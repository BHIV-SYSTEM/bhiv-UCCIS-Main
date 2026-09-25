function dashboardStateUpdater(
  execution
) {

  return {

    dashboard_updated: true,

    active_zone:
      execution
      .tantra_execution
      .trace_id,

    ui_status:
      execution
      .tantra_execution
      .ui_evolution
      .ui_status,

    escalation_visible: true,

    replay_visible: true
  };
}

module.exports =
dashboardStateUpdater;