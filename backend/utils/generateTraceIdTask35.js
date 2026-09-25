const generateTraceIdTask35 = () => {
  return `TRACE-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

module.exports = generateTraceIdTask35;