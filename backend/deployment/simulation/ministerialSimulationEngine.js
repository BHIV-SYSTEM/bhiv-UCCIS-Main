const tantraFlowOrchestrator =
require("../../tantra/convergence/tantraFlowOrchestrator");

function ministerialSimulationEngine(
  payload
) {

  const tantraExecution =
    tantraFlowOrchestrator(
      payload
    );

  return {

    simulation_mode:
      "MINISTERIAL_EXECUTION",

    execution_status:
      "COMPLETED",

    tantra_execution:
      tantraExecution
  };
}

module.exports =
ministerialSimulationEngine;