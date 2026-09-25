const { task25DB: db } = require("../config/db");

class EscalationTask25 {
  static create(data, callback) {
    db.run(
      `INSERT INTO escalations
      (incident_id,escalation_level,escalated_to,status)
      VALUES (?,?,?,?)`,
      [
        data.incident_id,
        data.escalation_level,
        data.escalated_to,
        data.status,
      ],
      function (err) {
        callback(err, this?.lastID);
      }
    );
  }

  static getAll(callback) {
    db.all(`SELECT * FROM escalations`, callback);
  }
}

module.exports = EscalationTask25;