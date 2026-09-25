const { task28DB } = require("../config/db");

exports.getRuntimeChain = async (req, res) => {

  try {

    const [rows] = await db.query(`
      SELECT
        s.signal_id,
        t.event_id,
        i.incident_id
      FROM signals s
      LEFT JOIN telemetry_events t
        ON s.signal_id = t.signal_id
      LEFT JOIN incidents i
        ON t.event_id = i.event_id
    `);

    res.json(rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};

exports.getRuntimeSummary = async (req, res) => {

  try {

    const [[signals]] =
      await db.query(
        "SELECT COUNT(*) total FROM signals"
      );

    const [[incidents]] =
      await db.query(
        "SELECT COUNT(*) total FROM incidents"
      );

    const [[telemetry]] =
      await db.query(
        "SELECT COUNT(*) total FROM telemetry_events"
      );

    res.json({
      signals: signals.total,
      incidents: incidents.total,
      telemetry: telemetry.total
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: error.message
    });

  }
};