"""Run the full Cosmic Intelligence prototype.

Usage:
    python run_experiment.py
"""

from pathlib import Path

from src.config import SimulationConfig
from src.experiments import run_parameter_sweeps, run_single_experiment


def main() -> None:
    output_dir = Path("outputs")
    config = SimulationConfig(
        num_agents=20,
        num_features=8,
        communication_probability=0.25,
        iterations=45,
        observation_probability=0.45,
        observation_noise=0.28,
        learning_rate=0.12,
        dynamic_network=True,
        random_seed=42,
    )

    main_result = run_single_experiment(config, output_dir)
    sweep_result = run_parameter_sweeps(config, output_dir)

    print("\nCosmic Intelligence prototype completed.")
    print("Main experiment summary:")
    for key, value in main_result["summary"].items():
        print(f"  {key}: {value:.3f}")

    print("\nGenerated files:")
    print("  outputs/main_history.csv")
    print("  outputs/experiment_summary.csv")
    print("  outputs/ieee_results_section.md")
    print("  outputs/figures/agent_communication_network.png")
    print("  outputs/figures/knowledge_propagation.png")
    print("  outputs/figures/accuracy_vs_agents.png")
    print("  outputs/figures/density_vs_intelligence.png")
    print("  outputs/figures/emergent_intelligence_growth.png")
    print("  outputs/figures/metrics_heatmap.png")
    print(f"\nSweep rows generated: {len(sweep_result['all_rows'])}")


if __name__ == "__main__":
    main()

