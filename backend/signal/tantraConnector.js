const fixedTrace = "TANTRA_123456";

exports.generateSignal = (data) => {
  return {
    trace_id: fixedTrace,
    timestamp: new Date().toISOString(),
    payload: data
  };
};