const requestTracker = (
  req,
  res,
  next
) => {
  req.traceId =
    "TRACE-" +
    Math.floor(
      Math.random() * 1000000
    );

  next();
};

module.exports = requestTracker;