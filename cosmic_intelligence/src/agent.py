"""Adaptive agents with local knowledge and memory."""

from __future__ import annotations

from dataclasses import dataclass, field

import numpy as np


@dataclass
class AgentMemoryItem:
    """Small memory record stored after every task."""

    prediction: int
    label: int
    confidence: float
    known_fraction: float


@dataclass
class CosmicAgent:
    """One distributed AI agent with partial knowledge.

    The agent maintains a belief vector about the current task. Unknown
    features are represented by zeros until communication fills them in.
    """

    agent_id: int
    num_features: int
    memory_limit: int
    reliability: float = 0.5
    belief: np.ndarray = field(init=False)
    known_mask: np.ndarray = field(init=False)
    memory: list[AgentMemoryItem] = field(default_factory=list)

    def __post_init__(self) -> None:
        self.belief = np.zeros(self.num_features, dtype=float)
        self.known_mask = np.zeros(self.num_features, dtype=bool)

    def observe(self, observation: np.ndarray, mask: np.ndarray) -> None:
        """Store this agent's local task observation."""

        self.belief = observation.copy()
        self.known_mask = mask.copy()

    def share_packet(self) -> dict[str, np.ndarray | float | int]:
        """Create a compact message for neighboring agents."""

        return {
            "agent_id": self.agent_id,
            "belief": self.belief.copy(),
            "known_mask": self.known_mask.copy(),
            "reliability": float(self.reliability),
        }

    def receive_packets(self, packets: list[dict[str, np.ndarray | float | int]]) -> int:
        """Merge neighboring beliefs into local belief.

        Returns the number of newly learned feature values. Reliability acts as
        a simple adaptive trust weight.
        """

        newly_known = 0
        for packet in packets:
            neighbor_belief = packet["belief"]
            neighbor_mask = packet["known_mask"]
            neighbor_reliability = float(packet["reliability"])
            trust = 0.25 + 0.75 * neighbor_reliability

            fill_mask = np.logical_and(neighbor_mask, ~self.known_mask)
            newly_known += int(fill_mask.sum())
            self.belief[fill_mask] = neighbor_belief[fill_mask]
            self.known_mask[fill_mask] = True

            overlap = np.logical_and(neighbor_mask, self.known_mask)
            self.belief[overlap] = (
                (1.0 - trust) * self.belief[overlap]
                + trust * neighbor_belief[overlap]
            )

        return newly_known

    def predict(self, feature_weights: np.ndarray) -> tuple[int, float]:
        """Predict the binary risk label from the current belief."""

        known_fraction = self.known_fraction()
        score = float(np.dot(self.belief, feature_weights))
        confidence = min(1.0, abs(score) * 0.8 + known_fraction * 0.4)
        return int(score >= 0.0), confidence

    def adapt(self, prediction: int, label: int, confidence: float, learning_rate: float) -> None:
        """Update reliability based on whether this agent predicted correctly."""

        reward = 1.0 if prediction == label else 0.0
        self.reliability = (1.0 - learning_rate) * self.reliability + learning_rate * reward
        self.reliability = float(np.clip(self.reliability, 0.05, 0.98))
        self.memory.append(
            AgentMemoryItem(
                prediction=prediction,
                label=label,
                confidence=confidence,
                known_fraction=self.known_fraction(),
            )
        )
        if len(self.memory) > self.memory_limit:
            self.memory.pop(0)

    def known_fraction(self) -> float:
        """How much of the task this agent currently knows."""

        return float(self.known_mask.mean())

