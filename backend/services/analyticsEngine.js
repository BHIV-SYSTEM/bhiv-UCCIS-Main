const getSystemStats = async () => {
  return {
    activeSignals: 24,
    incidents: 8,
    escalations: 3,
    traces: 17
  };
};

module.exports = {
  getSystemStats
};