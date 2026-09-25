const { task24DB: db } = require("../config/db");

const createWorkflowStateTable = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS workflow_states (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      state_name TEXT,
      description TEXT
    )
  `);
};

module.exports = createWorkflowStateTable;