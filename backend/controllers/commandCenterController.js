const { task33DB } = require("../config/db");

/*
=====================================================
COMMAND CENTER OVERVIEW
=====================================================
*/

exports.getCommandCenter = async (req, res) => {
  try {
    const [signals] = await task33DB.query(`
      SELECT *
      FROM signals
      ORDER BY created_at DESC
      LIMIT 20
    `);

    const [telemetry] = await task33DB.query(`
      SELECT *
      FROM telemetry
      ORDER BY created_at DESC
      LIMIT 20
    `);

    const [incidents] = await task33DB.query(`
      SELECT *
      FROM incidents
      ORDER BY created_at DESC
      LIMIT 20
    `);

    const [escalations] = await task33DB.query(`
      SELECT *
      FROM escalations
      ORDER BY created_at DESC
      LIMIT 20
    `);

    const [replays] = await task33DB.query(`
      SELECT *
      FROM replay_events
      ORDER BY created_at DESC
      LIMIT 20
    `);

    const [evidence] = await task33DB.query(`
      SELECT *
      FROM runtime_evidence
      ORDER BY created_at DESC
      LIMIT 20
    `);

    res.json({
      success: true,
      summary: {
        signals: signals.length,
        telemetry: telemetry.length,
        incidents: incidents.length,
        escalations: escalations.length,
        replayEvents: replays.length,
        evidence: evidence.length
      },
      signals,
      telemetry,
      incidents,
      escalations,
      replays,
      evidence
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};

/*
=====================================================
EXECUTIVE SUMMARY
=====================================================
*/

exports.getExecutiveSummary = async (req, res) => {

  try {

    const [[signalCount]] = await task33DB.query(`
      SELECT COUNT(*) count
      FROM signals
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
      signalCount: signalCount.count,
      incidentCount: incidentCount.count,
      escalationCount: escalationCount.count,
      replayCount: replayCount.count,
      evidenceCount: evidenceCount.count
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};