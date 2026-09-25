module.exports = (req, res, next) => {
  const {
    incidentId,
    traceId
  } = req.body;

  if (!incidentId) {
    return res.status(400).json({
      success: false,
      message: "incidentId is required"
    });
  }

  if (!traceId) {
    return res.status(400).json({
      success: false,
      message: "traceId is required"
    });
  }

  next();
};