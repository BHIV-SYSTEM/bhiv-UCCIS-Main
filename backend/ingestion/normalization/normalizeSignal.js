const crypto = require("crypto");

function normalizeSignal(rawData, sourceType) {

  const uniqueId = crypto.randomUUID();

  return {

    signal_id: `SIG-${uniqueId}`,

    source_type: sourceType,

    zone: rawData.zone || "UNKNOWN",

    metrics: rawData.metrics || {},

    severity: rawData.severity || "LOW",

    timestamp: rawData.timestamp || new Date(),

    stale: false,

    replay_safe_id: `RPL-${uniqueId}`,

    trace_id: `TRACE-${crypto.randomUUID()}`
  };
}

module.exports = normalizeSignal;