const { task24DB: db } = require("../config/db");

const createAlertTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      incident_id INTEGER,
      alert_type TEXT,
      generated_at TEXT
    )
  `);
};

module.exports = createAlertTable;