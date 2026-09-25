function tantraGovernanceProcessor(
  intelligence
) {

  return {

    trace_id:
      intelligence.trace_id,

    stage:
      "GOVERNANCE",

    governance_state:
      intelligence.escalation
      === "CRITICAL"
        ? "APPROVED"
        : "HOLD",

    governance_priority:
      intelligence.intelligence_score,

    timestamp:
      new Date()
  };
}

module.exports =
tantraGovernanceProcessor;