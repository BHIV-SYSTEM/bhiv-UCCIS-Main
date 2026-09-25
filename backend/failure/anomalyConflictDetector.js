// failure/anomalyConflictDetector.js

class AnomalyConflictDetector {

  check(anomalies) {

    if (
      anomalies &&
      anomalies.length > 3
    ) {

      return {

        conflict: true,

        type:
          "ANOMALY_CONFLICT",

        reason:
          "Too many simultaneous anomalies",

        recovery:
          "Escalate manual review"
      };
    }

    return {

      conflict: false
    };
  }
}

module.exports =
  new AnomalyConflictDetector();