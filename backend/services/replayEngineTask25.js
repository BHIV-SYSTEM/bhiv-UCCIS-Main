const ReplaySession = require("../models/ReplaySession");
const logger = require("./runtimeLogger");

function record(signalId) {
  ReplaySession.create(
    {
      session_name: `Replay-${signalId}`,
      start_time: new Date().toISOString(),
      end_time: null,
    },
    () => {}
  );

  logger.writeLog(
    "replay",
    `Replay session created for signal ${signalId}`
  );
}

module.exports = {
  record,
};