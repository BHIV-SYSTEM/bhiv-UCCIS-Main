const logger = require("./runtimeLogger");

function publish(signal) {
  logger.writeLog(
    "backend",
    `Dashboard updated for ${signal.signal_type}`
  );

  return {
    success: true,
    message: "Dashboard Updated",
  };
}

module.exports = {
  publish,
};