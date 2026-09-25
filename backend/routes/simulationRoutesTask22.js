const express = require("express");

const router = express.Router();

/*
=========================================================
FLOOD SIMULATION
=========================================================
*/

router.get("/flood", (req, res) => {
  res.json({
    success: true,
    scenario: "Flood Simulation Triggered",
  });
});

/*
=========================================================
TRAFFIC SIMULATION
=========================================================
*/

router.get("/traffic", (req, res) => {
  res.json({
    success: true,
    scenario:
      "Traffic Congestion Triggered",
  });
});

/*
=========================================================
WASTE SIMULATION
=========================================================
*/

router.get("/waste", (req, res) => {
  res.json({
    success: true,
    scenario: "Waste Overflow Triggered",
  });
});

module.exports = router;