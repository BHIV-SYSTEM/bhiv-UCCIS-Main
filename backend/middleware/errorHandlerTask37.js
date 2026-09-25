const errorHandlerTask37 = (
  err,
  req,
  res,
  next
) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Server Error"
  });
};

module.exports = errorHandlerTask37;