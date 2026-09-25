const { task28DB } = require("../config/db");

exports.createIncident = async (req, res) => {
  try {

    const {
      telemetry_id,
      incident_type,
      severity
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO incidents
      (
        telemetry_id,
        incident_type,
        severity,
        status
      )
      VALUES
      (?, ?, ?, ?)
      `,
      [
        telemetry_id,
        incident_type,
        severity,
        "OPEN"
      ]
    );

    res.status(201).json({
      success: true,
      incident_id: result.insertId
    });

  } catch (error) {
    res.status(500).json(error);
  }
};