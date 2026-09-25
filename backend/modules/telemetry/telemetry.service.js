const Telemetry =
  require("./telemetry.model");

class TelemetryService {
  async create(data) {
    return await Telemetry.create(data);
  }

  async getAll() {
    return await Telemetry.find()
      .sort({ createdAt: -1 });
  }
}

module.exports =
  new TelemetryService();