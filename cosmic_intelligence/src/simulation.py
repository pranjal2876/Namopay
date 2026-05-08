"""Main distributed simulation loop."""

from __future__ import annotations

from dataclasses import asdict

import networkx as nx
import numpy as np

from .agent import CosmicAgent
from .config import SimulationConfig
from .environment import DisasterRiskEnvironment
from .metrics import collective_intelligence_score, emergence_score
from .network import communication_density, create_communication_graph, evolve_network


class CosmicIntelligenceSimulation:
    """Distributed multimodal-style collective intelligence simulation."""

    def __init__(self, config: SimulationConfig) -> None:
        self.config = config
        self.rng = np.random.default_rng(config.random_seed)
        self.environment = DisasterRiskEnvironment(config.num_features, self.rng)
        self.graph = create_communication_graph(
            config.num_agents,
            config.communication_probability,
            self.rng,
        )
        self.agents = [
            CosmicAgent(
                agent_id=index,
                num_features=config.num_features,
                memory_limit=config.memory_limit,
            )
            for index in range(config.num_agents)
        ]
        self.history: list[dict[str, float | int]] = []

    def run(self) -> dict[str, object]:
        """Execute all iterations and return metrics plus final state."""

        for iteration in range(self.config.iterations):
            self._run_iteration(iteration)

            should_rewire = (
                self.config.dynamic_network
                and self.config.rewiring_interval > 0
                and (iteration + 1) % self.config.rewiring_interval == 0
            )
            if should_rewire:
                reliabilities = [agent.reliability for agent in self.agents]
                self.graph = evolve_network(self.graph, reliabilities, self.rng)

        return {
            "config": asdict(self.config),
            "graph": self.graph,
            "agents": self.agents,
            "history": self.history,
            "summary": self.summary(),
        }

    def _run_iteration(self, iteration: int) -> None:
        world_state, label = self.environment.sample_task()

        for agent in self.agents:
            observation, mask = self.environment.make_partial_observation(
                world_state,
                self.config.observation_probability,
                self.config.observation_noise,
            )
            agent.observe(observation, mask)

        initial_knowledge = float(np.mean([agent.known_fraction() for agent in self.agents]))
        message_count, learned_features = self._communicate()

        predictions = []
        confidences = []
        for agent in self.agents:
            prediction, confidence = agent.predict(self.environment.feature_weights)
            predictions.append(prediction)
            confidences.append(confidence)

        collective_prediction = self._collective_decision(predictions, confidences)
        collective_correct = int(collective_prediction == label)
        individual_accuracy = float(np.mean(np.array(predictions) == label))
        knowledge_coverage = float(np.mean([agent.known_fraction() for agent in self.agents]))
        propagation_gain = max(0.0, knowledge_coverage - initial_knowledge)

        # Efficiency is high when the system learns much with fewer messages.
        communication_efficiency = float(
            propagation_gain / (1.0 + message_count / max(1, self.config.num_agents))
        )

        emergence = emergence_score(
            collective_accuracy=float(collective_correct),
            mean_individual_accuracy=individual_accuracy,
            knowledge_coverage=knowledge_coverage,
            communication_efficiency=communication_efficiency,
        )
        ci_score = collective_intelligence_score(
            collective_accuracy=float(collective_correct),
            emergence=emergence,
            knowledge_coverage=knowledge_coverage,
            density=communication_density(self.graph),
        )

        for agent, prediction, confidence in zip(self.agents, predictions, confidences):
            agent.adapt(prediction, label, confidence, self.config.learning_rate)

        self.history.append(
            {
                "iteration": iteration + 1,
                "label": label,
                "collective_prediction": collective_prediction,
                "collective_accuracy": float(collective_correct),
                "mean_individual_accuracy": individual_accuracy,
                "knowledge_coverage": knowledge_coverage,
                "knowledge_propagation_gain": propagation_gain,
                "message_count": message_count,
                "learned_features": learned_features,
                "communication_density": communication_density(self.graph),
                "communication_efficiency": communication_efficiency,
                "emergence_score": emergence,
                "collective_intelligence_score": ci_score,
            }
        )

    def _communicate(self) -> tuple[int, int]:
        """Perform one round of neighbor-to-neighbor message passing."""

        packets_by_agent = {agent.agent_id: agent.share_packet() for agent in self.agents}
        message_count = 0
        learned_features = 0

        for agent in self.agents:
            neighbor_packets = []
            for neighbor_id in self.graph.neighbors(agent.agent_id):
                neighbor_packets.append(packets_by_agent[neighbor_id])
            message_count += len(neighbor_packets)
            learned_features += agent.receive_packets(neighbor_packets)

        return message_count, learned_features

    def _collective_decision(self, predictions: list[int], confidences: list[float]) -> int:
        """Weighted voting consensus."""

        votes = np.array(predictions, dtype=float)
        weights = np.array(confidences, dtype=float) + np.array(
            [agent.reliability for agent in self.agents], dtype=float
        )
        weighted_vote = float(np.average(votes, weights=weights))
        return int(weighted_vote >= 0.5)

    def summary(self) -> dict[str, float]:
        """Aggregate metrics from the second half of the run."""

        if not self.history:
            return {}
        tail = self.history[len(self.history) // 2 :]
        keys = [
            "collective_accuracy",
            "mean_individual_accuracy",
            "knowledge_coverage",
            "knowledge_propagation_gain",
            "communication_density",
            "communication_efficiency",
            "emergence_score",
            "collective_intelligence_score",
        ]
        return {key: float(np.mean([row[key] for row in tail])) for key in keys}


def graph_snapshot(graph: nx.Graph) -> dict[str, float]:
    """Compact graph properties useful for result tables."""

    return {
        "nodes": float(graph.number_of_nodes()),
        "edges": float(graph.number_of_edges()),
        "density": communication_density(graph),
        "average_clustering": float(nx.average_clustering(graph)) if graph.number_of_nodes() else 0.0,
        "average_degree": float(np.mean([degree for _, degree in graph.degree()])) if graph.number_of_nodes() else 0.0,
    }

