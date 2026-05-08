"""NetworkX communication graphs for distributed agents."""

from __future__ import annotations

import networkx as nx
import numpy as np


def create_communication_graph(
    num_agents: int,
    communication_probability: float,
    rng: np.random.Generator,
) -> nx.Graph:
    """Create a connected random graph when possible."""

    seed = int(rng.integers(0, 2**32 - 1))
    graph = nx.erdos_renyi_graph(num_agents, communication_probability, seed=seed)

    if num_agents > 1 and not nx.is_connected(graph):
        components = [list(component) for component in nx.connected_components(graph)]
        for left, right in zip(components[:-1], components[1:]):
            graph.add_edge(int(rng.choice(left)), int(rng.choice(right)))

    return graph


def communication_density(graph: nx.Graph) -> float:
    """Return the fraction of possible edges that are present."""

    return float(nx.density(graph))


def evolve_network(
    graph: nx.Graph,
    agent_reliabilities: list[float],
    rng: np.random.Generator,
    add_probability: float = 0.25,
    remove_probability: float = 0.12,
) -> nx.Graph:
    """Let high-performing agents become communication hubs over time."""

    evolved = graph.copy()
    nodes = list(evolved.nodes)
    if len(nodes) < 3:
        return evolved

    reliabilities = np.array(agent_reliabilities, dtype=float)
    probabilities = reliabilities / (reliabilities.sum() + 1e-9)

    if rng.random() < add_probability:
        source = int(rng.choice(nodes, p=probabilities))
        target = int(rng.choice(nodes))
        if source != target:
            evolved.add_edge(source, target)

    if rng.random() < remove_probability and evolved.number_of_edges() > len(nodes) - 1:
        edge = list(evolved.edges)[int(rng.integers(0, evolved.number_of_edges()))]
        evolved.remove_edge(*edge)
        if not nx.is_connected(evolved):
            evolved.add_edge(*edge)

    return evolved

