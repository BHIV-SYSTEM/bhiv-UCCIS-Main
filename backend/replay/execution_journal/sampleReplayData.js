module.exports = [

  {
    trace_id:
      "TRACE-FLOOD-001",

    stage:
      "SIGNAL",

    state:
      "DETECTED",

    timestamp:
      "2026-05-08T10:00:00Z",

    data: {
      flood_level: 88
    }
  },

  {
    trace_id:
      "TRACE-FLOOD-001",

    stage:
      "INTELLIGENCE",

    state:
      "ANALYZED",

    timestamp:
      "2026-05-08T10:02:00Z",

    data: {
      escalation:
        "CRITICAL"
    }
  },

  {
    trace_id:
      "TRACE-FLOOD-001",

    stage:
      "GOVERNANCE",

    state:
      "APPROVED",

    timestamp:
      "2026-05-08T10:05:00Z"
  },

  {
    trace_id:
      "TRACE-FLOOD-001",

    stage:
      "EXECUTION",

    state:
      "DRAINAGE_DEPLOYED",

    timestamp:
      "2026-05-08T10:08:00Z"
  },

  {
    trace_id:
      "TRACE-FLOOD-001",

    stage:
      "RESOLUTION",

    state:
      "STABILIZED",

    timestamp:
      "2026-05-08T10:20:00Z"
  }
];