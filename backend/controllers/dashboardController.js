const { mysqlDB } = require("../config/db");

exports.getDashboard =
async (req, res) => {

  try {

    const [rows] =
      await mysqlDB.query(`
      SELECT
      s.signal_id,
      s.signal_type,
      t.event_status,
      i.severity,
      e.escalated_to
      FROM signals s
      LEFT JOIN telemetry_events t
      ON s.signal_id=t.signal_id
      LEFT JOIN incidents i
      ON t.event_id=i.event_id
      LEFT JOIN escalations e
      ON i.incident_id=e.incident_id
    `);

    res.json(rows);

  } catch (error) {

    res.status(500).json({
      error:error.message
    });

  }

};