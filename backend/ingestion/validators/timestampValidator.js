function validateTimestamp(signal) {

  const currentTime = new Date().getTime();

  const signalTime = new Date(signal.timestamp).getTime();

  const difference = currentTime - signalTime;

  const minutes = difference / (1000 * 60);

  return minutes <= 30;
}

module.exports = validateTimestamp;