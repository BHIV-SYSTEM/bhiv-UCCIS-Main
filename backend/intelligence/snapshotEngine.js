exports.createSnapshot = (signal, processed, raw) => {
  return {
    trace_id: signal.trace_id,
    timestamp: signal.timestamp,
    zones: processed,
    raw_input: raw
  };
};