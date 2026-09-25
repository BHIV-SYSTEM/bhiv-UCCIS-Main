function getEscalationAging() {
  return [
    {
      trace_id: "TRACE_ESC_001",
      aging_minutes: 18,
      status: "ACTIVE"
    },
    {
      trace_id: "TRACE_ESC_002",
      aging_minutes: 42,
      status: "UNRESOLVED"
    }
  ];
}

module.exports = {
  getEscalationAging
};