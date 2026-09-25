const randomFailure = require("./entropySimulator");

function observabilityFailure(replay) {

  if (randomFailure(0.3)) {

    replay.partialObservability = true;

  } else {

    replay.partialObservability = false;

  }

  return replay;
}

module.exports = observabilityFailure;