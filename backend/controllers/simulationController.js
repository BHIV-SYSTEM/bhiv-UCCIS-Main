const fs = require("fs");

exports.runFloodScenario = (req, res) => {
  const scenario = {
    signal: "FLOOD_ALERT",
    telemetry: "DEGRADED",
    escalation: "HIGH_PRIORITY",
    replay: "RECORDED",
    runtime: "ACTIVE"
  };

  fs.appendFileSync(
    "./runtime_logs/runtime.log",
    JSON.stringify(scenario) + "\n"
  );

  res.json({
    success: true,
    scenario,
  });
};