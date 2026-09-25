const processSignal = require("./SignalProcessor");
const processTelemetry = require("./TelemetryProcessor");
const processIncident = require("./IncidentProcessor");
const processEscalation = require("./EscalationProcessor");
const processReplay = require("./ReplayProcessor");
const processEvidence = require("./EvidenceProcessor");

const executeRuntimeChain = async (traceId) => {
  const signal = await processSignal(traceId);

  const telemetry = await processTelemetry(traceId);

  const incident = await processIncident(traceId);

  const escalation = await processEscalation(traceId);

  const replay = await processReplay(traceId);

  const evidence = await processEvidence(traceId);

  return {
    traceId,

    signal,

    telemetry,

    incident,

    escalation,

    replay,

    evidence,

    completed: true,

    completedAt: new Date()
  };
};

module.exports = executeRuntimeChain;