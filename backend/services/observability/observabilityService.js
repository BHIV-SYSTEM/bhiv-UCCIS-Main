class ObservabilityService {
  getSystemHealth() {
    return {
      status: "Healthy",

      cpuUsage:
        Math.floor(
          Math.random() * 40
        ) + "%",

      memoryUsage:
        Math.floor(
          Math.random() * 60
        ) + "%",

      activeServices: 12,

      timestamp: new Date()
    };
  }

  getLogs() {
    return [
      {
        level: "INFO",
        message:
          "Runtime Initialized"
      },
      {
        level: "INFO",
        message:
          "Replay Engine Ready"
      },
      {
        level: "INFO",
        message:
          "Telemetry Active"
      }
    ];
  }
}

module.exports =
  new ObservabilityService();