const Telemetry =
require("../../models/Telemetry");

exports.generate =
async signalId => {

  return await Telemetry.create({

    signalId,

    cpuUsage:
      process.cpuUsage().user,

    memoryUsage:
      process.memoryUsage()
        .heapUsed,

    uptime:
      process.uptime(),

    timestamp:
      new Date()

  });

};

exports.findAll =
async () => {

  return await Telemetry.find()
    .sort({ timestamp: -1 });

};