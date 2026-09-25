function detectStaleSignal(signal) {

  const currentTime = new Date().getTime();

  const signalTime = new Date(signal.timestamp).getTime();

  const difference = currentTime - signalTime;

  const minutes = difference / (1000 * 60);

  if (minutes > 30) {
    signal.stale = true;
  }

  return signal;
}

module.exports = detectStaleSignal;