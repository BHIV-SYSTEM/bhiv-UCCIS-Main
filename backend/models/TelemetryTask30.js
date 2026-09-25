const { task30DB } = require("../config/db");

class TelemetryTask30 {

  static getAll() {
    return db.promise().query(
      "SELECT * FROM telemetry_events ORDER BY event_id DESC"
    );
  }

  static getById(id) {
    return db.promise().query(
      "SELECT * FROM telemetry_events WHERE event_id = ?",
      [id]
    );
  }

  static create(signalId, eventStatus) {
    return db.promise().query(
      `INSERT INTO telemetry_events
      (
        signal_id,
        event_status
      )
      VALUES (?, ?)`,
      [
        signalId,
        eventStatus
      ]
    );
  }

}

module.exports = TelemetryTask30;