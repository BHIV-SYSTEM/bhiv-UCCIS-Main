function detectStaleSignal(signal) {

  const currentTime =
    new Date().getTime();

  const signalTime =
    new Date(
      signal.timestamp
    ).getTime();

  const differenceMinutes =
    (currentTime - signalTime)
    / 1000 / 60;

  return differenceMinutes > 15;
}

module.exports =
detectStaleSignal;