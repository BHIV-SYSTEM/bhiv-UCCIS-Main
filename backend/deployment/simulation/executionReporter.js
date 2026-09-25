function executionReporter(
  execution,
  dashboard,
  audit,
  snapshot
) {

  return {

    simulation_completed: true,

    execution_status:
      execution.execution_status,

    dashboard,

    audit,

    snapshot,

    ministerial_visibility:
      "ACTIVE",

    replay_enabled: true
  };
}

module.exports =
executionReporter;