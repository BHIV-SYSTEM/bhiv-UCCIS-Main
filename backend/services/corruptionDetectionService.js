function detectReplayCorruption(
  replay
) {
  return replay.some(
    event =>
      !event.trace_id ||
      !event.timestamp ||
      !event.sequence
  );
}

module.exports = {
  detectReplayCorruption
};