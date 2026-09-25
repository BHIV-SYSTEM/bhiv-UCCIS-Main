const { task32DB } = require("../config/db");

exports.logRuntimeEvent = async (
  connection,
  traceId,
  eventType,
  eventMessage
) => {
  await connection.query(
    `
    INSERT INTO runtime_logs
    (
      trace_id,
      event_type,
      event_message
    )
    VALUES
    (?, ?, ?)
    `,
    [
      traceId,
      eventType,
      eventMessage
    ]
  );
};