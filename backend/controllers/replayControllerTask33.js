const { task33DB, task33Ready } = require("../config/db");

const ensureTask33Ready = async () => {
  await task33Ready;
};

/*
=====================================================
ALL REPLAY EVENTS
=====================================================
*/

exports.getReplayEvents = async (req, res) => {

  try {

    await ensureTask33Ready();

    const [rows] = await task33DB.query(`
      SELECT *
      FROM replay_events
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      count: rows.length,
      data: rows
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
REPLAY BY TRACE
=====================================================
*/

exports.getReplayByTrace = async (req, res) => {

  try {

    await ensureTask33Ready();

    const { traceId } = req.params;

    const [rows] = await task33DB.query(
      `
      SELECT *
      FROM replay_events
      WHERE trace_id=?
      ORDER BY created_at DESC
      `,
      [traceId]
    );

    res.json({
      success: true,
      data: rows
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
TRACE EVIDENCE
=====================================================
*/

exports.getEvidenceByTrace = async (req, res) => {

  try {

    await ensureTask33Ready();

    const { traceId } = req.params;

    const [rows] = await task33DB.query(
      `
      SELECT *
      FROM runtime_evidence
      WHERE trace_id=?
      ORDER BY created_at DESC
      `,
      [traceId]
    );

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }

};