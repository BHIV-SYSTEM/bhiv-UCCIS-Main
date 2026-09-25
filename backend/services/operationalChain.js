const db = require("../config/db");

const runFloodScenario = async () => {
  const connection = await db.promise().getConnection();

  try {
    await connection.beginTransaction();

    // ======================
    // SIGNAL
    // ======================

    const [signalResult] = await connection.query(
      `INSERT INTO signals
      (
        signal_type,
        location_id
      )
      VALUES (?, ?)`,
      [
        "Flood Alert",
        1
      ]
    );

    const signalId = signalResult.insertId;

    // ======================
    // TELEMETRY
    // ======================

    const [telemetryResult] = await connection.query(
      `INSERT INTO telemetry_events
      (
        signal_id,
        event_status
      )
      VALUES (?, ?)`,
      [
        signalId,
        "ACTIVE"
      ]
    );

    const eventId = telemetryResult.insertId;

    // ======================
    // INCIDENT
    // ======================

    const [incidentResult] = await connection.query(
      `INSERT INTO incidents
      (
        signal_id, incident_type
      )
      VALUES (?, ?)`,
      [
        eventId,
        "HIGH"
      ]
    );

    const incidentId = incidentResult.insertId;

    // ======================
    // ESCALATION
    // ======================

    await connection.query(
      `INSERT INTO escalations
      (
        incident_id
      )
      VALUES (?)`,
      [
        incidentId
      ]
    );

    // ======================
    // DECISION
    // ======================

    await connection.query(
      `INSERT INTO decisions
      (
        incident_id
      )
      VALUES (?)`,
      [
        incidentId
      ]
    );

    // ======================
    // REPLAY SESSION
    // ======================

    await connection.query(
      `INSERT INTO replay_sessions
      (
        incident_id
      )
      VALUES (?)`,
      [
        incidentId
      ]
    );

    // ======================
    // RUNTIME LOG
    // ======================

    await connection.query(
      `INSERT INTO runtime_logs
      (
        incident_id
      )
      VALUES (?)`,
      [
        incidentId
      ]
    );

    await connection.commit();

    return {
      success: true,
      signalId,
      eventId,
      incidentId,
      message: "Flood Scenario Completed Successfully",
      chain: [
        "Signal Created",
        "Telemetry Created",
        "Incident Created",
        "Escalation Created",
        "Decision Created",
        "Replay Session Created",
        "Runtime Log Created"
      ]
    };

  } catch (error) {

    await connection.rollback();

    console.log("FAILED SQL:");
    console.log(error.sql);

    console.log(error);

    throw error;

  } finally {

    connection.release();

  }
};

module.exports = {
  runFloodScenario
};