const { readAllEvents } = require("./eventJournalService");

function initializeRecovery() {
  const events = readAllEvents();

  console.log("Recovery Initialized");
  console.log("Recovered Events:", events.length);
}

module.exports = {
  initializeRecovery
};