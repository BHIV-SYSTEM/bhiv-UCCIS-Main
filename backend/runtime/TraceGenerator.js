class TraceGenerator {
  static generateTraceId() {
    return (
      "TRACE-" +
      Date.now() +
      "-" +
      Math.floor(Math.random() * 10000)
    );
  }

  static generateSignalId() {
    return (
      "SIG-" +
      Date.now() +
      "-" +
      Math.floor(Math.random() * 10000)
    );
  }

  static generateIncidentId() {
    return (
      "INC-" +
      Date.now() +
      "-" +
      Math.floor(Math.random() * 10000)
    );
  }

  static generateEscalationId() {
    return (
      "ESC-" +
      Date.now() +
      "-" +
      Math.floor(Math.random() * 10000)
    );
  }
}

module.exports = TraceGenerator;