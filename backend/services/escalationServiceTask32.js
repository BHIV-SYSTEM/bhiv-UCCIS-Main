exports.createEscalation = async (
  connection,
  escalationId,
  traceId,
  incidentId
) => {
  await connection.query(
    `
    INSERT INTO escalations
    (
      escalation_id,
      trace_id,
      incident_id,
      level,
      status
    )
    VALUES
    (?, ?, ?, ?, ?)
    `,
    [
      escalationId,
      traceId,
      incidentId,
      "LEVEL-1",
      "ACTIVE"
    ]
  );

  return {
    escalation_id: escalationId,
    trace_id: traceId
  };
};