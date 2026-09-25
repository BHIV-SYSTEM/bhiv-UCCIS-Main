exports.generateEvidence = (
  traceId,
  signalId,
  telemetryId,
  incidentId,
  escalationId,
  startTime
) => {
  const endTime = Date.now();

  return {
    trace_id: traceId,

    execution_timestamp:
      new Date().toISOString(),

    execution_duration_ms:
      endTime - startTime,

    generated_ids: {
      signal_id: signalId,
      telemetry_id: telemetryId,
      incident_id: incidentId,
      escalation_id: escalationId
    },

    runtime_events: [
      "Signal Created",
      "Telemetry Created",
      "Incident Created",
      "Escalation Created"
    ]
  };
};