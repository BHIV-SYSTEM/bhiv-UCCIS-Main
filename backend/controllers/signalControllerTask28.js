const { task28DB } = require("../config/db");

exports.createSignal = async (req, res) => {
  try {
    const {
      location_id,
      signal_type,
      severity
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO signals
      (location_id, signal_type, severity, status)
      VALUES (?, ?, ?, ?)
      `,
      [
        location_id,
        signal_type,
        severity,
        "ACTIVE"
      ]
    );

    const signalId = result.insertId;

    await db.query(
      `
      INSERT INTO telemetry_events
      (signal_id, telemetry_data)
      VALUES (?, ?)
      `,
      [
        signalId,
        JSON.stringify({
          source: signal_type,
          severity
        })
      ]
    );

    res.status(201).json({
      success: true,
      signal_id: signalId
    });

  } catch (error) {
    res.status(500).json(error);
  }
};