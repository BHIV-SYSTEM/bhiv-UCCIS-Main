const { task28DB } = require("../config/db");

class IncidentTask28 {

  static async create(data) {

    const [result] = await db.query(
      `
      INSERT INTO incidents
      (
        telemetry_id,
        incident_type,
        severity,
        status
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        data.telemetry_id,
        data.incident_type,
        data.severity,
        "OPEN"
      ]
    );

    return result;
  }
}

module.exports = IncidentTask28;