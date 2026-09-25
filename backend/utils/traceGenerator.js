exports.generateTraceId = () => {
  return `TRACE-${Date.now()}`;
};

exports.generateSignalId = () => {
  return `SIG-${Date.now()}`;
};

exports.generateTelemetryId = () => {
  return `TEL-${Date.now()}`;
};

exports.generateIncidentId = () => {
  return `INC-${Date.now()}`;
};

exports.generateEscalationId = () => {
  return `ESC-${Date.now()}`;
};