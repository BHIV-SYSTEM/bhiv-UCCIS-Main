const { emit } = require("./eventBus");

function simulateCorruption() {
  return emit("CORRUPTION", {
    damagedPacket: true,
    replayMismatch: true
  });
}

function recoverReplay() {
  return {
    recovered: true,
    lineagePreserved: true,
    appendOnlyIntegrity: true,
    replayReconstructed: true
  };
}

module.exports = {
  simulateCorruption,
  recoverReplay
};