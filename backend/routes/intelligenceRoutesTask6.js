const router = require("express").Router();
const fs = require("fs");

const { computeRisk, getState } = require("../core/deterministicEngine");
const { pushState } = require("../memory/stateHistory");

const FILE = "./data/state_history.json";

router.post("/evaluate", (req, res) => {
  try {
    const d = req.body;

    const risk = computeRisk(d);
    const state = getState(risk);

    const result = {
      zone_id: String(d.zone_id).toLowerCase(),
      risk_score: risk,
      current_state: state,
      confidence_score:
        d.confidence_score !== undefined ? d.confidence_score : 95,
      timestamp: new Date().toISOString()
    };

    // Save to replay memory
    pushState(result);

    // Save to JSON file
    let data = [];

    if (fs.existsSync(FILE)) {
      try {
        const raw = fs.readFileSync(FILE, "utf8");
        data = raw ? JSON.parse(raw) : [];
      } catch (err) {
        data = [];
      }
    }

    data.push(result);

    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

    res.json({
      success: true,
      ...result
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