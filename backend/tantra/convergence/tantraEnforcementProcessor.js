function tantraEnforcementProcessor(
  governance
) {

  return {

    trace_id:
      governance.trace_id,

    stage:
      "ENFORCEMENT",

    enforcement_action:
      governance.governance_state
      === "APPROVED"
        ? "FIELD_RESPONSE_DEPLOYED"
        : "AWAITING_CLEARANCE",

    timestamp:
      new Date()
  };
}

module.exports =
tantraEnforcementProcessor;