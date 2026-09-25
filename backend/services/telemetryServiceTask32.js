exports.createTelemetry = async (
  connection,
  telemetryId,
  traceId,
  signalId
) => {
  await connection.query(
    `
    INSERT INTO telemetry
    (
      telemetry_id,
      trace_id,
      signal_id,
      payload
    )
    VALUES
    (?, ?, ?, ?)
    `,
    [
      telemetryId,
      traceId,
      signalId,
      JSON.stringify({
        source: "UCCIS Runtime"
      })
    ]
  );

  return {
    telemetry_id: telemetryId,
    trace_id: traceId
  };
};