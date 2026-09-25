const { task32DB } = require("../config/db");

const generateId = (prefix) => {
  return `${prefix}-${Date.now()}`;
};

exports.executeSignal = async (req, res) => {
  const connection =
    await task32DB.promise().getConnection();

  try {
    await connection.beginTransaction();

    const { signal_id, signal_type } =
      req.body;

    const traceId = generateId("TRACE");

    const telemetryId =
      generateId("TEL");

    const incidentId =
      generateId("INC");

    const escalationId =
      generateId("ESC");

    await connection.query(
      `INSERT INTO signals
      (
        signal_id,
        trace_id,
        signal_type,
        status
      )
      VALUES (?,?,?,?)`,
      [
        signal_id,
        traceId,
        signal_type,
        "ACTIVE"
      ]
    );

    await connection.query(
      `INSERT INTO telemetry
      (
        telemetry_id,
        trace_id,
        signal_id
      )
      VALUES (?,?,?)`,
      [
        telemetryId,
        traceId,
        signal_id
      ]
    );

    await connection.query(
      `INSERT INTO incidents
      (
        incident_id,
        trace_id,
        telemetry_id,
        severity,
        status
      )
      VALUES (?,?,?,?,?)`,
      [
        incidentId,
        traceId,
        telemetryId,
        "HIGH",
        "OPEN"
      ]
    );

    await connection.query(
      `INSERT INTO escalations
      (
        escalation_id,
        trace_id,
        incident_id,
        level,
        status
      )
      VALUES (?,?,?,?,?)`,
      [
        escalationId,
        traceId,
        incidentId,
        "LEVEL-1",
        "ACTIVE"
      ]
    );

    await connection.query(
      `INSERT INTO runtime_logs
      (
        trace_id,
        event_type,
        event_message
      )
      VALUES (?,?,?)`,
      [
        traceId,
        "CHAIN_EXECUTION",
        "Signal -> Telemetry -> Incident -> Escalation"
      ]
    );

    await connection.commit();

    res.status(200).json({
      success: true,
      trace_id: traceId,
      signal_id,
      telemetry_id: telemetryId,
      incident_id: incidentId,
      escalation_id: escalationId
    });

  } catch (error) {

    await connection.rollback();

    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });

  } finally {
    connection.release();
  }
};