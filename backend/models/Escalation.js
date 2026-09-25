const { task24DB: db } = require("../config/db");

const createEscalationTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS escalations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      incident_id INTEGER,
      level INTEGER,
      escalated_at TEXT
    )
  `);
};

module.exports = createEscalationTable;