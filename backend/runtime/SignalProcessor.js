const processSignal = async (traceId) => {
  return {
    traceId,
    layer: "Signal",
    status: "SUCCESS",
    timestamp: new Date()
  };
};

module.exports = processSignal;