exports.createIncident = async (
  connection,
  incidentId,
  traceId,
  telemetryId
) => {
  await connection.query(
    `
    INSERT INTO incidents
    (
      incident_id,
      trace_id,
      telemetry_id,
      severity,
      status
    )
    VALUES
    (?, ?, ?, ?, ?)
    `,
    [
      incidentId,
      traceId,
      telemetryId,
      "HIGH",
      "OPEN"
    ]
  );

  return {
    incident_id: incidentId,
    trace_id: traceId
  };
};