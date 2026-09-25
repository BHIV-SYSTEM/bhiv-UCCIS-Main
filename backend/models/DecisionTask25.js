const { task25DB: db } = require("../config/db");

class DecisionTask25 {
  static create(data, callback) {
    db.run(
      `INSERT INTO decisions
      (incident_id,decision_text)
      VALUES (?,?)`,
      [data.incident_id, data.decision_text],
      function (err) {
        callback(err, this?.lastID);
      }
    );
  }

  static getAll(callback) {
    db.all(`SELECT * FROM decisions`, callback);
  }
}

module.exports = DecisionTask25;