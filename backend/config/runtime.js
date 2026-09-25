const runtimeConfig = {
  environment: process.env.NODE_ENV || "development",

  runtimeHealth: "Healthy",

  replayEnabled: true,

  telemetryEnabled: true,

  observabilityEnabled: true,

  version: "1.0.0",

  region: "India",

  traceRetentionDays: 30
};

module.exports = runtimeConfig;