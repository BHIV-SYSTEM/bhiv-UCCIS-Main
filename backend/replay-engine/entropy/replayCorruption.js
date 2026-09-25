const randomFailure = require("./entropySimulator");

function replayCorruption(replay) {

  if (randomFailure(0.25)) {

    replay.corruptionAttempt = true;

    replay.confidence =
      replay.confidence - 30;

  } else {

    replay.corruptionAttempt = false;

  }

  return replay;
}

module.exports = replayCorruption;