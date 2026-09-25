const { task24DB: db } = require("../config/db");

const createRuntimeTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS runtimes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_name TEXT,
      status TEXT,
      updated_at TEXT
    )
  `);
};

module.exports = createRuntimeTable;