const express = require("express");
const router = express.Router();

const { pushState } = require("../memory/stateHistory");

const lastState = {};

router.post("/request", (req, res) => {
  try {
    let {
      zone_id,
      current_state,
      trace_id,
      risk_score,
      confidence_score
    } = req.body;

    // Validation
    if (!zone_id) {
      return res.status(400).json({
        success: false,
        message: "zone_id is required"
      });
    }

    if (!trace_id) {
      return res.status(400).json({
        success: false,
        message: "trace_id is required"
      });
    }

    zone_id = String(zone_id).toLowerCase();
    current_state = current_state || "UNKNOWN";
    risk_score = Number(risk_score) || 0;
    confidence_score = Number(confidence_score) || 0;

    // Ignore duplicate state
    if (lastState[zone_id] === current_state) {
      return res.json({
        success: true,
        status: "ignored",
        reason: "duplicate_state"
      });
    }

    lastState[zone_id] = current_state;

    // Save replay history
    pushState({
      zone_id,
      current_state,
      risk_score,
      confidence_score,
      timestamp: new Date().toISOString()
    });

    console.log(`Replay saved for ${zone_id}`);

    res.json({
      success: true,
      status: "execution_created",
      zone_id,
      current_state,
      risk_score,
      confidence_score
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;