"""Configuration objects for the Cosmic Intelligence simulation."""

from dataclasses import dataclass


@dataclass(frozen=True)
class SimulationConfig:
    """Parameters that control one simulation run.

    The defaults are intentionally modest so the prototype runs quickly in
    Google Colab while still producing visible emergent behavior.
    """

    num_agents: int = 20
    num_features: int = 8
    communication_probability: float = 0.25
    iterations: int = 40
    observation_probability: float = 0.45
    observation_noise: float = 0.28
    learning_rate: float = 0.12
    memory_limit: int = 12
    dynamic_network: bool = True
    rewiring_interval: int = 8
    random_seed: int = 42

