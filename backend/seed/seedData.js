const TelemetryTask26 = require("../models/TelemetryTask26");
const RuntimeLogTask26 = require("../models/RuntimeLogTask26");

const seedDatabase = async () => {
  const tCount = await TelemetryTask26.countDocuments();
  const rCount = await RuntimeLogTask26.countDocuments();

  if (tCount === 0) {
    await TelemetryTask26.insertMany([
      { signalId: "T1", type: "CPU", value: 65, status: "OK" },
      { signalId: "T2", type: "MEM", value: 78, status: "WARN" },
      { signalId: "T3", type: "DISK", value: 40, status: "OK" }
    ]);

    console.log("Telemetry seed inserted 🚀");
  }

  if (rCount === 0) {
    await RuntimeLogTask26.insertMany([
      { module: "backend", message: "System boot complete", level: "INFO" },
      { module: "telemetry", message: "Stream active", level: "INFO" }
    ]);

    console.log("Runtime seed inserted 🚀");
  }
};

module.exports = seedDatabase;