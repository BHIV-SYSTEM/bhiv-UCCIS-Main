const { task28DB } = require("../config/db");

class TelemetryEventTask28 {

  static async create(signalId, telemetry) {

    const [result] = await db.query(
      `
      INSERT INTO telemetry_events
      (
        signal_id,
        telemetry_data
      )
      VALUES (?, ?)
      `,
      [
        signalId,
        JSON.stringify(telemetry)
      ]
    );

    return result;
  }
}

module.exports = TelemetryEventTask28;