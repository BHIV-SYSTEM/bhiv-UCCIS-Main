const { task24DB: db } = require("../config/db");

const createApprovalTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS approvals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      decision_id INTEGER,
      approved_by TEXT,
      approval_time TEXT
    )
  `);
};

module.exports = createApprovalTable;