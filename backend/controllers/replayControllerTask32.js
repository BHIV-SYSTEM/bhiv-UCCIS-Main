const { task32DB } = require("../config/db");

exports.getReplay = async (req, res) => {
  try {
    const { traceId } = req.params;

    const [signals] = await task32DB.query(
      "SELECT * FROM signals WHERE trace_id = ?",
      [traceId]
    );

    const [telemetry] = await task32DB.query(
      "SELECT * FROM telemetry WHERE trace_id = ?",
      [traceId]
    );

    const [incidents] = await task32DB.query(
      "SELECT * FROM incidents WHERE trace_id = ?",
      [traceId]
    );

    const [escalations] = await task32DB.query(
      "SELECT * FROM escalations WHERE trace_id = ?",
      [traceId]
    );

    const [logs] = await task32DB.query(
      "SELECT * FROM runtime_logs WHERE trace_id = ? ORDER BY created_at ASC",
      [traceId]
    );

    res.status(200).json({
      success: true,
      trace_id: traceId,

      signal: signals.length > 0 ? signals[0] : null,

      telemetry:
        telemetry.length > 0
          ? telemetry[0]
          : null,

      incident:
        incidents.length > 0
          ? incidents[0]
          : null,

      escalation:
        escalations.length > 0
          ? escalations[0]
          : null,

      timeline: logs
    });

  } catch (error) {
    console.error("Replay Error:", error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};