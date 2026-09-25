const { task24DB: db } = require("../config/db");

const createIncidentTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      severity TEXT,
      status TEXT,
      created_at TEXT
    )
  `);
};

module.exports = createIncidentTable;