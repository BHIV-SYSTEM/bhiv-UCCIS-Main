const { task28DB } = require("../config/db");

exports.createEscalation = async (req, res) => {

  try {

    const {
      incident_id,
      escalation_level
    } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO escalations
      (
        incident_id,
        escalation_level,
        assigned_team
      )
      VALUES
      (?, ?, ?)
      `,
      [
        incident_id,
        escalation_level,
        "Emergency Response"
      ]
    );

    res.status(201).json({
      success: true,
      escalation_id: result.insertId
    });

  } catch (error) {
    res.status(500).json(error);
  }
};