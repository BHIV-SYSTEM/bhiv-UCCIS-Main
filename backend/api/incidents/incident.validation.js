module.exports = (req, res, next) => {
  const {
    signalId,
    traceId,
    severity,
    status
  } = req.body;

  // Signal ID Validation
  if (!signalId || signalId.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "signalId is required"
    });
  }

  // Trace ID Validation
  if (!traceId || traceId.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "traceId is required"
    });
  }

  // Severity Validation
  const allowedSeverity = [
    "Low",
    "Medium",
    "High",
    "Critical"
  ];

  if (
    !severity ||
    !allowedSeverity.includes(severity)
  ) {
    return res.status(400).json({
      success: false,
      message:
        "severity must be Low, Medium, High or Critical"
    });
  }

  // Status Validation
  if (status) {
    const allowedStatus = [
      "Open",
      "Investigating",
      "Escalated",
      "Resolved",
      "Closed"
    ];

    if (
      !allowedStatus.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid incident status"
      });
    }
  }

  next();
};