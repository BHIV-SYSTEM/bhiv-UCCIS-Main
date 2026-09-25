const { task32DB } = require("../config/db");

exports.createSignal = async (
  connection,
  signalId,
  traceId,
  signalType
) => {
  await connection.query(
    `
    INSERT INTO signals
    (
      signal_id,
      trace_id,
      signal_type,
      status
    )
    VALUES
    (?, ?, ?, ?)
    `,
    [
      signalId,
      traceId,
      signalType,
      "ACTIVE"
    ]
  );

  return {
    signal_id: signalId,
    trace_id: traceId
  };
};