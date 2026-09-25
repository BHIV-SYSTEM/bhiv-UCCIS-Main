class TelemetryService {
  constructor() {
    this.metrics = [];
  }

  recordMetric(name, value) {
    this.metrics.push({
      name,
      value,
      timestamp: new Date()
    });

    return {
      success: true,
      message: "Metric Recorded"
    };
  }

  getMetrics() {
    return this.metrics;
  }

  getTelemetrySummary() {
    return {
      totalMetrics: this.metrics.length,
      exporter: "Console",
      tracesEnabled: true,
      logsEnabled: true
    };
  }
}

module.exports = new TelemetryService();