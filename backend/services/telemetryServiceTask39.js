const TelemetryTask39 =
require("../models/TelemetryTask39");

class TelemetryService {

  async generate(signal) {

    return await TelemetryTask39.create({

      signalId:
        signal.signalId,

      cpuUsage:
        process.cpuUsage().user,

      memoryUsage:
        process.memoryUsage().heapUsed,

      uptime:
        process.uptime(),

      timestamp:
        new Date()

    });

  }

  async getAll() {

    return await TelemetryTask39.find()
      .sort({ timestamp: -1 });

  }

}

module.exports =
new TelemetryService();