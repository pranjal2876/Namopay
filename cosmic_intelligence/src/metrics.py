"""Research metrics for emergent collective intelligence."""

from __future__ import annotations

import numpy as np


def moving_average(values: list[float], window: int = 5) -> list[float]:
    """Simple moving average for smoother plots."""

    if not values:
        return []
    result = []
    for index in range(len(values)):
        start = max(0, index - window + 1)
        result.append(float(np.mean(values[start : index + 1])))
    return result


def emergence_score(
    collective_accuracy: float,
    mean_individual_accuracy: float,
    knowledge_coverage: float,
    communication_efficiency: float,
) -> float:
    """Quantify improvement beyond isolated individual behavior.

    The score rewards the collective only when group performance exceeds mean
    individual performance, while also considering propagated knowledge and the
    cost of communication.
    """

    synergy = max(0.0, collective_accuracy - mean_individual_accuracy)
    return float(0.45 * synergy + 0.35 * knowledge_coverage + 0.20 * communication_efficiency)


def collective_intelligence_score(
    collective_accuracy: float,
    emergence: float,
    knowledge_coverage: float,
    density: float,
) -> float:
    """Single paper-friendly score combining accuracy, emergence, and cost."""

    communication_penalty = max(0.0, density - 0.65) * 0.25
    score = 0.50 * collective_accuracy + 0.30 * emergence + 0.20 * knowledge_coverage
    return float(np.clip(score - communication_penalty, 0.0, 1.0))

