function staleReplayCheck(replay) {

  const current = new Date().getTime();
  const replayTime = new Date(replay.timestamp).getTime();

  const difference = current - replayTime;

  if (difference > 10000) {
    replay.stale = true;
  }

  return replay;
}

module.exports = staleReplayCheck;