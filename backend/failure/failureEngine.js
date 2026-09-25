// failure/failureEngine.js

const schemaValidator =
  require("./schemaValidator");

const duplicateDetector =
  require("./duplicateDetector");

const staleSignalDetector =
  require("./staleSignalDetector");

const replayChecker =
  require("./replayIntegrityChecker");

const propagationFailureDetector =
  require("./propagationFailureDetector");

const anomalyConflictDetector =
  require("./anomalyConflictDetector");

class FailureEngine {

  validate(input) {

    // =====================================
    // SCHEMA VALIDATION
    // =====================================

    const schema =
      schemaValidator.validate(
        input
      );

    if (!schema.valid) {

      return this.error(schema);
    }

    // =====================================
    // DUPLICATE REQUEST
    // =====================================

    const duplicate =
      duplicateDetector.check(

        input.trace_id ||
        "TEMP-" + input.zone_id
      );

    if (duplicate.duplicate) {

      return this.error(duplicate);
    }

    // =====================================
    // STALE SIGNAL
    // =====================================

    const stale =
      staleSignalDetector.check(

        input.timestamp ||
        Date.now()
      );

    if (stale.stale) {

      return this.error(stale);
    }

    // =====================================
    // REPLAY CORRUPTION
    // =====================================

    const replay =
      replayChecker.validate(
        input.replay
      );

    if (replay.corrupted) {

      return this.error(replay);
    }

    // =====================================
    // PROPAGATION FAILURE
    // =====================================

    const propagation =
      propagationFailureDetector
        .check(
          input.cluster_intelligence
        );

    if (propagation.failed) {

      return this.error(propagation);
    }

    // =====================================
    // ANOMALY CONFLICT
    // =====================================

    const anomaly =
      anomalyConflictDetector
        .check(
          input.anomalies
        );

    if (anomaly.conflict) {

      return this.error(anomaly);
    }

    // =====================================
    // PASSED
    // =====================================

    return {

      success: true
    };
  }

  // =====================================
  // STRUCTURED ERROR
  // =====================================

  error(data) {

    return {

      success: false,

      trace_visibility:
        "TRACE-" + Date.now(),

      error_type:
        data.type,

      readable_reason:
        data.reason,

      recovery_recommendation:
        data.recovery
    };
  }
}

module.exports =
  new FailureEngine();