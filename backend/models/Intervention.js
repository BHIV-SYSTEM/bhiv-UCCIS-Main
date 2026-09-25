const { task24DB: db } = require("../config/db");

const createInterventionTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS interventions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      escalation_id INTEGER,
      action_taken TEXT,
      performed_at TEXT
    )
  `);
};

module.exports = createInterventionTable;