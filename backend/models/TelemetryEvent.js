const db = require("../config/db");

class TelemetryEvent {
  static create(data, callback) {
    db.run(
      `INSERT INTO telemetry_events
      (signal_id,event_type,status)
      VALUES (?,?,?)`,
      [data.signal_id, data.event_type, data.status],
      function (err) {
        callback(err, this?.lastID);
      }
    );
  }

  static getAll(callback) {
    db.all(
      `SELECT * FROM telemetry_events ORDER BY id DESC`,
      callback
    );
  }
}

module.exports = TelemetryEvent;