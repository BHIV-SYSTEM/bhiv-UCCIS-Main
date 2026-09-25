const task33DB = require("../config/db");

exports.getRuntimeHealth = async (req, res) => {

  try {

    const [[signalCount]] = await task33DB.query(`
      SELECT COUNT(*) count
      FROM signals
    `);

    const [[telemetryCount]] = await task33DB.query(`
      SELECT COUNT(*) count
      FROM telemetry
    `);

    const [[incidentCount]] = await task33DB.query(`
      SELECT COUNT(*) count
      FROM incidents
    `);

    const [[escalationCount]] = await task33DB.query(`
      SELECT COUNT(*) count
      FROM escalations
    `);

    const [[replayCount]] = await task33DB.query(`
      SELECT COUNT(*) count
      FROM replay_events
    `);

    const [[evidenceCount]] = await task33DB.query(`
      SELECT COUNT(*) count
      FROM runtime_evidence
    `);

    res.json({
      success: true,
      backendStatus: "UP",
      databaseStatus: "CONNECTED",
      signalCount: signalCount.count,
      telemetryCount: telemetryCount.count,
      incidentCount: incidentCount.count,
      escalationCount: escalationCount.count,
      replayCount: replayCount.count,
      evidenceCount: evidenceCount.count,
      lastRuntimeExecution: new Date()
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      backendStatus: "DOWN",
      databaseStatus: "DISCONNECTED",
      error: error.message
    });

  }

};