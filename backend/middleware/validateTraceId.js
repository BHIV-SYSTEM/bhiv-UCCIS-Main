const validateTraceId = (
  req,
  res,
  next
) => {

  const traceId =
    req.params.traceId ||
    req.body.traceId;

  if (!traceId) {
    return res.status(400).json({
      success: false,
      message:
        "traceId is required"
    });
  }

  next();
};

module.exports =
  validateTraceId;