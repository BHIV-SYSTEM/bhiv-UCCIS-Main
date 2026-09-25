// backend/replay-engine/replayCore.js

let replayLineage = [];

function generateReplay() {

  const replay = {

    id:
      Math.floor(
        Math.random() * 100000
      ),

    timestamp:
      new Date().toISOString(),

    event: "SIGNAL_EVENT",

    confidence:
      Math.floor(
        Math.random() * 40
      ) + 60,

    divergence:
      Math.random() > 0.5,

    corruptionAttempt:
      Math.random() > 0.7,

    delayedRecovery:
      Math.random() > 0.6,

    operatorDisconnected:
      Math.random() > 0.5,

    stale:
      Math.random() > 0.5

  };

  replayLineage.push(replay);

  return replay;

}

function getLineage() {

  return replayLineage;

}

module.exports = {

  generateReplay,

  getLineage

};