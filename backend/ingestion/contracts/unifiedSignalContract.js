function createUnifiedSignalContract(data) {

  return {
    signal_id: data.signal_id,
    source_type: data.source_type,
    zone: data.zone,

    metrics: data.metrics,

    severity: data.severity,

    timestamp: data.timestamp,

    ingestion_timestamp: new Date(),

    stale: data.stale,

    replay_safe_id: data.replay_safe_id,

    trace_id: data.trace_id
  };
}

module.exports = createUnifiedSignalContract;