const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    data: [
      {
        escalation_id: "ESC001",
        district: "Pune",
        priority: "CRITICAL",
        status: "OPEN",
      },
      {
        escalation_id: "ESC002",
        district: "Mumbai",
        priority: "HIGH",
        status: "ACKNOWLEDGED",
      },
    ],
  });
});

module.exports = router;