class TelemetryTask34 {
  constructor(data) {
    this.id = data.id;
    this.traceId = data.traceId;
    this.metricName = data.metricName;
    this.metricValue = data.metricValue;
    this.status = data.status;
    this.createdAt = data.createdAt;
  }
}

module.exports = TelemetryTask34;