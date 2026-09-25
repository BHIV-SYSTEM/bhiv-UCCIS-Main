module.exports = (req, res, next) => {

  const {
    source,
    severity,
    payload
  } = req.body;

  if (!source) {
    return res.status(400).json({
      success: false,
      message: "source is required"
    });
  }

  const levels = [
    "Low",
    "Medium",
    "High",
    "Critical"
  ];

  if (
    !severity ||
    !levels.includes(severity)
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid severity"
    });
  }

  if (!payload) {
    return res.status(400).json({
      success: false,
      message: "payload is required"
    });
  }

  next();
};