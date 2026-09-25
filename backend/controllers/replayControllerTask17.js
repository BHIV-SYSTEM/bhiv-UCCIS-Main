const {
  writeReplayLog
} = require("../services/loggerService");

const getReplayStatus = (req, res) => {

  writeReplayLog("Replay status checked");

  res.json({
    replay: "stable",
    confidence: "92%",
    divergence: false
  });
};

const reconstructReplay = (req, res) => {

  writeReplayLog(
    "Replay reconstruction executed"
  );

  res.json({
    message: "Replay reconstructed",
    confidence: "95%"
  });
};

module.exports = {
  getReplayStatus,
  reconstructReplay
};