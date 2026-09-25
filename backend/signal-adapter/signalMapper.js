const mapSignalToUCCIS = (signal) => {
  return {
    signal_id: signal.id,
    signal_type: signal.type,
    severity: signal.severity || "medium",
    region: signal.region || "unknown",

    telemetry_event: {
      signal_id: signal.id,
      type: signal.type,
      severity: signal.severity || "medium",
      region: signal.region || "unknown"
    },

    incident: {
      title: `${signal.type} Incident`,
      status: "CREATED",
      signal_id: signal.id
    },

    escalation: {
      level: signal.severity === "high" ? 2 : 1,
      status: "PENDING"
    },

    replay_session: {
      status: "INITIATED"
    },

    runtime_log: {
      event: "SIGNAL_CONSUMED",
      status: "SUCCESS",
      signal_id: signal.id
    }
  };
};

module.exports = { mapSignalToUCCIS };