const successResponse = (
  message,
  data,
  traceId = null
) => {
  return {
    success: true,
    message,
    traceId,
    data,
    timestamp: new Date()
  };
};

const errorResponse = (
  message,
  error = null
) => {
  return {
    success: false,
    message,
    error,
    timestamp: new Date()
  };
};

module.exports = {
  successResponse,
  errorResponse
};