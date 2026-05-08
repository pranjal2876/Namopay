"""Matplotlib visualizations for the research prototype."""

from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import networkx as nx
import numpy as np

from .metrics import moving_average


def _prepare_output(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def plot_network(graph: nx.Graph, reliabilities: list[float], output_path: Path) -> None:
    """Visualize the final agent communication network."""

    _prepare_output(output_path)
    plt.figure(figsize=(9, 7))
    positions = nx.spring_layout(graph, seed=7)
    node_colors = reliabilities
    node_sizes = [450 + 900 * value for value in reliabilities]

    nx.draw_networkx_edges(graph, positions, alpha=0.35, width=1.4)
    nodes = nx.draw_networkx_nodes(
        graph,
        positions,
        node_color=node_colors,
        node_size=node_sizes,
        cmap="viridis",
        vmin=0.0,
        vmax=1.0,
        edgecolors="#111111",
        linewidths=0.8,
    )
    nx.draw_networkx_labels(graph, positions, font_size=8, font_color="white")
    plt.colorbar(nodes, label="Agent reliability")
    plt.title("Agent Communication Network")
    plt.axis("off")
    plt.tight_layout()
    plt.savefig(output_path, dpi=180)
    plt.close()


def plot_knowledge_propagation(history: list[dict[str, float | int]], output_path: Path) -> None:
    """Plot how much task knowledge is available after communication."""

    _prepare_output(output_path)
    iterations = [row["iteration"] for row in history]
    coverage = [row["knowledge_coverage"] for row in history]
    gain = [row["knowledge_propagation_gain"] for row in history]

    plt.figure(figsize=(9, 5))
    plt.plot(iterations, coverage, label="Total knowledge coverage", linewidth=2.2)
    plt.plot(iterations, gain, label="Propagation gain", linewidth=2.2)
    plt.ylim(0, 1.05)
    plt.xlabel("Iteration")
    plt.ylabel("Fraction of known features")
    plt.title("Knowledge Propagation Across Agents")
    plt.grid(alpha=0.25)
    plt.legend()
    plt.tight_layout()
    plt.savefig(output_path, dpi=180)
    plt.close()


def plot_emergence_growth(history: list[dict[str, float | int]], output_path: Path) -> None:
    """Plot emergence and collective intelligence over time."""

    _prepare_output(output_path)
    iterations = [row["iteration"] for row in history]
    emergence = moving_average([row["emergence_score"] for row in history], window=5)
    ci_score = moving_average([row["collective_intelligence_score"] for row in history], window=5)

    plt.figure(figsize=(9, 5))
    plt.plot(iterations, emergence, label="Emergence score", linewidth=2.2)
    plt.plot(iterations, ci_score, label="Collective intelligence score", linewidth=2.2)
    plt.ylim(0, 1.05)
    plt.xlabel("Iteration")
    plt.ylabel("Score")
    plt.title("Emergent Intelligence Growth")
    plt.grid(alpha=0.25)
    plt.legend()
    plt.tight_layout()
    plt.savefig(output_path, dpi=180)
    plt.close()


def plot_accuracy_vs_agents(rows: list[dict[str, float]], output_path: Path) -> None:
    """Plot collective accuracy as the number of agents increases."""

    _prepare_output(output_path)
    rows = sorted(rows, key=lambda item: item["num_agents"])
    agents = [row["num_agents"] for row in rows]
    collective = [row["collective_accuracy"] for row in rows]
    individual = [row["mean_individual_accuracy"] for row in rows]

    plt.figure(figsize=(9, 5))
    plt.plot(agents, collective, marker="o", label="Collective accuracy", linewidth=2.2)
    plt.plot(agents, individual, marker="s", label="Mean individual accuracy", linewidth=2.2)
    plt.ylim(0, 1.05)
    plt.xlabel("Number of agents")
    plt.ylabel("Accuracy")
    plt.title("Accuracy vs Number of Agents")
    plt.grid(alpha=0.25)
    plt.legend()
    plt.tight_layout()
    plt.savefig(output_path, dpi=180)
    plt.close()


def plot_density_vs_intelligence(rows: list[dict[str, float]], output_path: Path) -> None:
    """Plot communication density against collective intelligence."""

    _prepare_output(output_path)
    rows = sorted(rows, key=lambda item: item["communication_probability"])
    probabilities = [row["communication_probability"] for row in rows]
    density = [row["communication_density"] for row in rows]
    ci_score = [row["collective_intelligence_score"] for row in rows]
    emergence = [row["emergence_score"] for row in rows]

    plt.figure(figsize=(9, 5))
    plt.plot(probabilities, ci_score, marker="o", label="Collective intelligence", linewidth=2.2)
    plt.plot(probabilities, emergence, marker="s", label="Emergence score", linewidth=2.2)
    plt.plot(probabilities, density, marker="^", label="Observed graph density", linewidth=2.2)
    plt.ylim(0, 1.05)
    plt.xlabel("Initial communication probability")
    plt.ylabel("Score / density")
    plt.title("Communication Density vs Intelligence")
    plt.grid(alpha=0.25)
    plt.legend()
    plt.tight_layout()
    plt.savefig(output_path, dpi=180)
    plt.close()


def plot_metric_heatmap(rows: list[dict[str, float]], output_path: Path) -> None:
    """Create a compact matrix view of major result metrics."""

    _prepare_output(output_path)
    metric_names = [
        "collective_accuracy",
        "mean_individual_accuracy",
        "knowledge_coverage",
        "emergence_score",
        "collective_intelligence_score",
    ]
    matrix = np.array([[row[name] for name in metric_names] for row in rows])

    plt.figure(figsize=(10, max(4, len(rows) * 0.38)))
    plt.imshow(matrix, aspect="auto", cmap="magma", vmin=0.0, vmax=1.0)
    plt.colorbar(label="Metric value")
    plt.xticks(range(len(metric_names)), [name.replace("_", "\n") for name in metric_names], fontsize=8)
    plt.yticks(range(len(rows)), [row["experiment"] for row in rows], fontsize=8)
    plt.title("Experimental Metrics Summary")
    plt.tight_layout()
    plt.savefig(output_path, dpi=180)
    plt.close()

