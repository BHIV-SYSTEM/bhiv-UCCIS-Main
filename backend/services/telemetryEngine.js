const TelemetryEvent = require("../models/TelemetryEvent");
const logger = require("./runtimeLogger");

function generate(signalId) {
  TelemetryEvent.create(
    {
      signal_id: signalId,
      event_type: "SIGNAL_RECEIVED",
      status: "SUCCESS",
    },
    () => {}
  );

  logger.writeLog(
    "telemetry",
    `Telemetry event generated for signal ${signalId}`
  );
}

module.exports = {
  generate,
};