const { task24DB: db } = require("../config/db");

const createTelemetryTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS telemetry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      signal_id INTEGER,
      metric_name TEXT,
      metric_value REAL,
      captured_at TEXT
    )
  `);
};

module.exports = createTelemetryTable;