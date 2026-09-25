class ObservabilityService {
  getMetrics() {
    return {
      runtimeHealth: 98,
      activeEvents: 42,
      latency: 120,
      throughput: 520,
      errorCount: 1,
      serviceStatus: "Healthy",
      dependencyStatus: "Healthy"
    };
  }
}

module.exports =
  new ObservabilityService();