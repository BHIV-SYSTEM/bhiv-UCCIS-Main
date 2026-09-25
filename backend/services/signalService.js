const telemetryStore = require("../data/telemetryStore");
const replayStore = require("../data/replayStore");
const escalationStore = require("../data/escalationStore");
const auditStore = require("../data/auditStore");

const generateSignal = () => {
  const signal = {
    id: Date.now(),
    signal: "DISTRICT ESCALATION SPIKE",
    severity: "HIGH",
    district: "PUNE",
    timestamp: new Date().toISOString()
  };

  /*
    TELEMETRY UPDATED
  */

  telemetryStore.incidents += 1;
  telemetryStore.entropy += 2;
  telemetryStore.escalationRisk = "HIGH";
  telemetryStore.runtimeStatus = "UNDER LOAD";

  /*
    ESCALATION GENERATED
  */

  escalationStore.push({
    escalationId: Date.now(),
    type: "FIELD ESCALATION",
    severity: "HIGH",
    district: "PUNE",
    createdAt: new Date().toISOString()
  });

  /*
    REPLAY EVENT RECORDED
  */

  replayStore.push({
    replayId: Date.now(),
    event: signal.signal,
    severity: signal.severity,
    timestamp: signal.timestamp
  });

  /*
    AUDIT LOG PRODUCED
  */

  auditStore.push({
    auditId: Date.now(),
    action: "SIGNAL GENERATED",
    result: "SUCCESS",
    timestamp: new Date().toISOString()
  });

  return signal;
};

module.exports = generateSignal;