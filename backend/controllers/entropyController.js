const {
  writeEntropyLog
} = require("../services/loggerService");

const injectEntropy = (req, res) => {

  writeEntropyLog(
    "Entropy injected into runtime"
  );

  res.json({
    message: "Entropy injected",
    uncertainty: "high",
    replay_divergence: true
  });
};

const getEntropyStatus = (req, res) => {

  writeEntropyLog(
    "Entropy status checked"
  );

  res.json({
    entropy_score: "34%",
    corruption_detected: true,
    telemetry_delay: true
  });
};

module.exports = {
  injectEntropy,
  getEntropyStatus
};