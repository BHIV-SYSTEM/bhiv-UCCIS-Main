function getUnresolvedGovernanceStates() {
  return [
    {
      trace_id: "TRACE_GOV_002",
      unresolved_state:
        "ENFORCEMENT_ROUTED"
    },
    {
      trace_id: "TRACE_GOV_003",
      unresolved_state:
        "EXECUTION_ACKNOWLEDGED"
    }
  ];
}

module.exports = {
  getUnresolvedGovernanceStates
};