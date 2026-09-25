const replayValidator = (
  replay
) => {

  if (!replay) {

    return {
      valid: false,
      reason: "Replay missing"
    };

  }

  if (replay.entropy > 25) {

    return {
      valid: false,
      reason: "Entropy threshold exceeded"
    };

  }

  if (replay.confidence < 85) {

    return {
      valid: false,
      reason: "Confidence too low"
    };

  }

  return {
    valid: true,
    reason: "Replay continuity verified"
  };

};

module.exports = replayValidator;