const { task25DB: db } = require("../config/db");

class ApprovalTask25 {
  static create(data, callback) {
    db.run(
      `INSERT INTO approvals
      (decision_id,approved_by,approval_status)
      VALUES (?,?,?)`,
      [
        data.decision_id,
        data.approved_by,
        data.approval_status,
      ],
      function (err) {
        callback(err, this?.lastID);
      }
    );
  }

  static getAll(callback) {
    db.all(`SELECT * FROM approvals`, callback);
  }
}

module.exports = ApprovalTask25;