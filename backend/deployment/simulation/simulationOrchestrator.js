const ministerialSimulationEngine =
require("./ministerialSimulationEngine");

const dashboardStateUpdater =
require("./dashboardStateUpdater");

const auditHistoryGenerator =
require("./auditHistoryGenerator");

const simulationSnapshotWriter =
require("./simulationSnapshotWriter");

const executionReporter =
require("./executionReporter");

function simulationOrchestrator(
  payload
) {

  /*
    Execute Tantra Flow
  */

  const execution =
    ministerialSimulationEngine(
      payload
    );

  /*
    Update Dashboard
  */

  const dashboard =
    dashboardStateUpdater(
      execution
    );

  /*
    Generate Audit
  */

  const audit =
    auditHistoryGenerator(
      execution
    );

  /*
    Store Snapshot
  */

  const snapshot =
    simulationSnapshotWriter(
      execution
    );

  /*
    Build Final Report
  */

  return executionReporter(

    execution,

    dashboard,

    audit,

    snapshot
  );
}

module.exports =
simulationOrchestrator;