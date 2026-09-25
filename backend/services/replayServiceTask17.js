const replayEngine = () => {

  return {
    replay_status: "stable",
    reconstruction_ready: true,
    divergence_detected: false
  };
};

module.exports = {
  replayEngine
};