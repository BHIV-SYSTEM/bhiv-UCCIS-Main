const stateStore =
  require("../engine/stateStore");

const trendEngine =
  require("../engine/trendEngine");

const transitionEngine =
  require("../engine/transitionEngine");

const durationEngine =
  require("../engine/durationEngine");

const conflictEngine =
  require("../engine/conflictEngine");

const governanceEngine =
  require("../engine/governanceEngine");

const lifecycleEngine =
  require("../engine/lifecycleEngine");

const timeoutEngine =
  require("../engine/timeoutEngine");

const retryEngine =
  require("../engine/retryEngine");

const snapshotEngine =
  require("../engine/snapshotEngine");

const anomalyEngine =
  require("../engine/anomalyEngine");

const propagationEngine =
  require("../engine/propagationEngine");

const clusterEngine =
  require("../engine/clusterEngine");

const confidenceEngine =
  require("../engine/confidenceEngine");

const auditEngine =
  require("../engine/auditEngine");

class TemporalService {

  // =====================================
  // MAIN PROCESS ENGINE
  // =====================================

  process(zoneId, domains) {

    // =====================================
    // PREVIOUS STATE
    // =====================================

    const previousState =
      stateStore.getLast(zoneId);

    // =====================================
    // HISTORY
    // =====================================

    const history =
      stateStore.getAll(zoneId);

    // =====================================
    // DOMAIN CONFLICT RESOLUTION
    // =====================================

    const intelligence =
      conflictEngine.resolve(domains);

    /*
      Example:
      {
        dominant_domain: "flooding",
        final_score: 95,
        reason: "flooding override activated",
        influenced_domains: {}
      }
    */

    // =====================================
    // TREND DETECTION
    // =====================================

    const previousScore =
      previousState
        ? previousState.final_score
        : null;

    const trend =
      trendEngine.detect(
        intelligence.final_score,
        previousScore
      );

    /*
      Possible:
      - UP
      - DOWN
      - STABLE
    */

    // =====================================
    // PREVIOUS LEVEL
    // =====================================

    const previousLevel =
      previousState
        ? previousState.final_level
        : "LOW";

    // =====================================
    // FINAL LEVEL CALCULATION
    // =====================================

    const finalLevel =
      transitionEngine.nextLevel(
        previousLevel,
        trend,
        intelligence.final_score
      );

    /*
      Possible:
      - LOW
      - MEDIUM
      - HIGH
    */

    // =====================================
    // BEHAVIOR CLASSIFICATION
    // =====================================

    let behavior = "STABLE";

    if (trend === "UP") {

      behavior = "ESCALATING";

    }

    if (trend === "DOWN") {

      behavior = "RECOVERING";

    }

    /*
      Possible:
      - ESCALATING
      - RECOVERING
      - STABLE
    */

    // =====================================
    // DURATION TRACKING
    // =====================================

    const duration =
      durationEngine.calculate(
        history
      );

    // =====================================
    // GOVERNANCE REQUEST CREATION
    // =====================================

    const governanceRequest =
      governanceEngine.createRequest({

        ...intelligence,

        final_level:
          finalLevel

      });

    /*
      Example:
      {
        governance_id: "GOV-123",
        requested_action: "EMERGENCY_RESPONSE"
      }
    */

    // =====================================
    // GOVERNANCE LIFECYCLE
    // =====================================

    let lifecycle =
      lifecycleEngine.resolveLifecycle(
        governanceRequest
      );

    /*
      Possible:
      - APPROVED
      - REJECTED
      - RETRY
      - HOLD
      - ESCALATED
    */

    // =====================================
    // TIMEOUT CHECK
    // =====================================

    const timeout =
      timeoutEngine.checkTimeout(
        governanceRequest
      );

    // =====================================
    // APPLY TIMEOUT STATE
    // =====================================

    if (timeout.timeout) {

      lifecycle = {

        lifecycle_state:
          timeout.state,

        lifecycle_reason:
          timeout.reason
      };
    }

    // =====================================
    // RETRY HANDLING
    // =====================================

    let retryData = {};

    if (
      lifecycle.lifecycle_state ===
      "RETRY"
    ) {

      retryData =
        retryEngine.handleRetry({

          retry_count: 0

        });

      lifecycle.lifecycle_state =
        retryData.lifecycle_state;

      lifecycle.lifecycle_reason =
        retryData.retry_reason;
    }

    // =====================================
    // TRACE ID
    // =====================================

    const traceId =
      "TRACE-" + Date.now();

    // =====================================
    // FINAL SNAPSHOT
    // =====================================

    const snapshot = {

      // TRACE
      trace_id:
        traceId,

      // ZONE
      zone_id:
        zoneId,

      // DOMAIN
      dominant_domain:
        intelligence.dominant_domain,

      // SCORE
      final_score:
        intelligence.final_score,

      // LEVEL
      final_level:
        finalLevel,

      // TREND
      trend,

      // BEHAVIOR
      behavior,

      // OVERRIDE REASON
      reason:
        intelligence.reason,

      // GOVERNANCE REQUEST
      governance_request:
        governanceRequest,

      // GOVERNANCE RESPONSE
      governance_response:
        lifecycle,

      // RETRY DATA
      retry_data:
        retryData,

      // TIMESTAMP
      timestamp:
        Date.now(),

      // TEMPORAL DURATION
      duration_in_state_ms:
        duration,

      // DOMAIN INFLUENCE
      influenced_domains:
        intelligence.influenced_domains
    };

    // =====================================
    // ANOMALY DETECTION
    // =====================================

    const anomalies =
      anomalyEngine.detect(
        snapshot,
        previousState
      );

    snapshot.anomalies =
      anomalies;

    /*
      Possible anomalies:
      - SUDDEN_SPIKE
      - IMPOSSIBLE_COMBINATION
      - STALE_TELEMETRY
      - ABNORMAL_RISK_DROP
      - ABNORMAL_PROPAGATION
    */

    // =====================================
    // ZONE PROPAGATION
    // =====================================

    const propagatedZones =
      propagationEngine.propagate(
        zoneId,
        intelligence.final_score
      );

    // =====================================
    // CLUSTER SCORE
    // =====================================

    const clusterScore =
      clusterEngine.calculateClusterScore(
        intelligence.final_score,
        propagatedZones
      );

    // =====================================
    // CLUSTER CLASSIFICATION
    // =====================================

    const clusterState =
      clusterEngine.classifyCluster(
        clusterScore
      );

    // =====================================
    // ATTACH CLUSTER INTELLIGENCE
    // =====================================

    snapshot.cluster_intelligence = {

      propagated_zones:
        propagatedZones,

      cluster_score:
        clusterScore,

      cluster_state:
        clusterState
    };

    // =====================================
    // CONFIDENCE ENGINE
    // =====================================

    const confidence =
      confidenceEngine.calculate({

        currentState:
          snapshot,

        previousState,

        anomalies,

        domains
      });

    // =====================================
    // ATTACH CONFIDENCE
    // =====================================

    snapshot.confidence =
      confidence;

    /*
      Example:
      confidence: {
        confidence_score: 64,
        confidence_reasoning: [
          "Missing domain data: complaints",
          "High multi-domain conflict severity"
        ]
      }
    */

    // =====================================
    // SAVE TEMPORAL STATE
    // =====================================

    stateStore.save(
      zoneId,
      snapshot
    );

    // =====================================
    // SAVE REPLAY SNAPSHOT
    // =====================================

    snapshotEngine.save(
      snapshot
    );

    // =====================================
    // IMMUTABLE AUDIT PERSISTENCE
    // =====================================

    auditEngine.persist(
      snapshot
    );

    // =====================================
    // RETURN RESPONSE
    // =====================================

    return {

      current_state:
        snapshot,

      history:
        stateStore.getAll(zoneId)

    };
  }

  // =====================================
  // GET HISTORY
  // =====================================

  getHistory(zoneId) {

    return stateStore.getAll(zoneId);

  }
}

module.exports =
  new TemporalService();