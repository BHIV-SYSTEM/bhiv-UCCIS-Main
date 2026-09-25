module.exports = (req, res, next) => {
  const {
    incidentId,
    traceId,
    priority,
    assignedTo
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

  if (!priority) {
    return res.status(400).json({
      success: false,
      message: "priority is required"
    });
  }

  next();
};