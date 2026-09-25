// failure/staleSignalDetector.js

class StaleSignalDetector {

  check(timestamp) {

    const now =
      Date.now();

    const diff =
      now - timestamp;

    if (diff > 60000) {

      return {

        stale: true,

        type:
          "STALE_SIGNAL",

        reason:
          "Signal older than 60 seconds",

        recovery:
          "Refresh upstream telemetry"
      };
    }

    return {

      stale: false
    };
  }
}

module.exports =
  new StaleSignalDetector();