const analytics = require("../services/analyticsEngine");

exports.getStats = async (req, res) => {
  try {
    const data = await analytics.getSystemStats();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};