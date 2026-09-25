const successResponse = (
  res,
  data,
  message = "Success"
) => {
  return res.status(200).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (
  res,
  message = "Error"
) => {
  return res.status(500).json({
    success: false,
    message
  });
};

module.exports = {
  successResponse,
  errorResponse
};