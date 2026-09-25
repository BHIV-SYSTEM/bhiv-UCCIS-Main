const crypto = require("crypto");

function buildExecutionContract(action) {

  return {

    execution_id:
      `EXEC-${crypto.randomUUID()}`,

    trace_id:
      action.trace_id,

    zone:
      action.zone,

    domain:
      action.domain,

    requested_action:
      action.requested_action,

    governance_state:
      action.governance_state,

    timestamp:
      new Date(),

    replay_visible: true,

    immutable: true
  };
}

module.exports =
buildExecutionContract;