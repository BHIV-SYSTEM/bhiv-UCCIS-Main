const randomFailure = require("./entropySimulator");

function operatorFailure(replay) {

  if (randomFailure(0.4)) {

    replay.operatorDisconnected = true;

  } else {

    replay.operatorDisconnected = false;

  }

  return replay;
}

module.exports = operatorFailure;