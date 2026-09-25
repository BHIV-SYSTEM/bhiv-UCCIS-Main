const { task24DB: db } = require("../config/db");

const createLocationTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS locations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      latitude REAL,
      longitude REAL,
      address TEXT
    )
  `);
};

module.exports = createLocationTable;