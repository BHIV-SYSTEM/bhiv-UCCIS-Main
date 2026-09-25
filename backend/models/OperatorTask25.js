const { task25DB: db } = require("../config/db");

class OperatorTask25 {
  static create(data, callback) {
    db.run(
      `INSERT INTO operators
      (name,department,role)
      VALUES (?,?,?)`,
      [data.name, data.department, data.role],
      function (err) {
        callback(err, this?.lastID);
      }
    );
  }

  static getAll(callback) {
    db.all(`SELECT * FROM operators`, callback);
  }
}

module.exports = OperatorTask25;