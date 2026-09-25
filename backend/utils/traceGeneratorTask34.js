const generateTraceId = () => {
  const timestamp = Date.now();

  const random = Math.floor(
    Math.random() * 100000
  );

  return `TRACE-${timestamp}-${random}`;
};

module.exports = generateTraceId;