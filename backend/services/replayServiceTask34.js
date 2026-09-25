const { task34DB } = require("../config/db");

exports.getReplayData = async () => {
  return {
    replayCount: 18,
    successfulReplay: 15,
    failedReplay: 3
  };
};

exports.startReplay = async () => {
  return {
    message: "Replay Started"
  };
};