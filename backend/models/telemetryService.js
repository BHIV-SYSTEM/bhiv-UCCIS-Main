const TelemetryEvent =
require("../models/TelemetryEvent");

exports.generateTelemetry =
async(signalId, severity) => {

  return await TelemetryEvent.create(
    signalId,
    {
      generated: true,
      severity,
      timestamp: new Date()
    }
  );
};