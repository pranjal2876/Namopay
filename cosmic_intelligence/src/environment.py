"""Synthetic disaster-risk environment used by the agents."""

from __future__ import annotations

import numpy as np


class DisasterRiskEnvironment:
    """Creates hidden risk scenarios and evaluates predictions.

    Each task is represented by a feature vector. Positive values indicate
    elevated evidence for disaster risk, and negative values indicate reduced
    risk. Agents only observe a subset of the vector, so no single agent has
    enough information to reliably solve every task.
    """

    def __init__(self, num_features: int, rng: np.random.Generator) -> None:
        self.num_features = num_features
        self.rng = rng
        self.feature_weights = rng.normal(loc=0.0, scale=1.0, size=num_features)
        self.feature_weights /= np.linalg.norm(self.feature_weights) + 1e-9

    def sample_task(self) -> tuple[np.ndarray, int]:
        """Return a hidden world state and its binary risk label."""

        world_state = self.rng.normal(loc=0.0, scale=1.0, size=self.num_features)
        risk_score = float(np.dot(world_state, self.feature_weights))
        label = int(risk_score >= 0.0)
        return world_state, label

    def make_partial_observation(
        self,
        world_state: np.ndarray,
        observation_probability: float,
        observation_noise: float,
    ) -> tuple[np.ndarray, np.ndarray]:
        """Give one agent a noisy, incomplete view of the task."""

        mask = self.rng.random(self.num_features) < observation_probability
        if not mask.any():
            mask[self.rng.integers(0, self.num_features)] = True

        noise = self.rng.normal(loc=0.0, scale=observation_noise, size=self.num_features)
        observation = np.zeros(self.num_features)
        observation[mask] = world_state[mask] + noise[mask]
        return observation, mask

