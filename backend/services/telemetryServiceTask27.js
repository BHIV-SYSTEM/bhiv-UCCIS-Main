const TelemetryEventTask27 = require("../models/TelemetryEventTask27");

class TelemetryServiceTask27 {
  static async create(signalId) {
    return await TelemetryEvent.create(
      signalId,
      "RECEIVED"
    );
  }
}

module.exports = TelemetryServiceTask27;