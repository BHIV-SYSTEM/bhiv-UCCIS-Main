const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json({
      success: true,
      timestamp: new Date(),
      data: {
        city: "Mumbai",
        risk_score: 78,
        governance_status: "ACTIVE"
      },
      message: "Dashboard loaded"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      timestamp: new Date(),
      error: error.message
    });
  }
});

module.exports = router;