const { task30DB } = require("../config/db");

class EscalationTask30 {
  static getAll() {
    return db.promise().query(
      "SELECT * FROM escalations"
    );
  }

  static getById(id) {
    return db.promise().query(
      "SELECT * FROM escalations WHERE escalation_id = ?",
      [id]
    );
  }

  static create(data) {
    return db.promise().query(
      "INSERT INTO escalations SET ?",
      [data]
    );
  }
}

module.exports = EscalationTask30;