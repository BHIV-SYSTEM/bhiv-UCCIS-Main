const processReplay = async (traceId) => {
  return {
    traceId,
    layer: "Replay",
    status: "SUCCESS",
    timestamp: new Date()
  };
};

module.exports = processReplay;