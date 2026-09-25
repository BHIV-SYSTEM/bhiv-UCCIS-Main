class AnomalyEngine {

  // =====================================
  // MAIN DETECTOR
  // =====================================

  detect(currentState, previousState) {

    const anomalies = [];

    // =====================================
    // SUDDEN SPIKE DETECTION
    // =====================================

    if (
      previousState &&
      Math.abs(
        currentState.final_score -
        previousState.final_score
      ) > 50
    ) {

      anomalies.push({

        anomaly_type:
          "SUDDEN_SPIKE",

        anomaly_reason:
          "Risk score changed too rapidly",

        confidence_impact:
          "HIGH",

        mitigation_recommendation:
          "Verify telemetry integrity"
      });
    }

    // =====================================
    // IMPOSSIBLE COMBINATION
    // =====================================

    const domains =
      currentState.influenced_domains;

    if (
      domains.flooding &&
      domains.water_shortage
    ) {

      if (
        domains.flooding.level === "HIGH" &&
        domains.water_shortage.level === "LOW"
      ) {

        anomalies.push({

          anomaly_type:
            "IMPOSSIBLE_COMBINATION",

          anomaly_reason:
            "Flood HIGH while water shortage LOW",

          confidence_impact:
            "MEDIUM",

          mitigation_recommendation:
            "Validate water infrastructure telemetry"
        });
      }
    }

    // =====================================
    // STALE TELEMETRY
    // =====================================

    const now = Date.now();

    if (
      now - currentState.timestamp >
      60000
    ) {

      anomalies.push({

        anomaly_type:
          "STALE_TELEMETRY",

        anomaly_reason:
          "Telemetry appears outdated",

        confidence_impact:
          "HIGH",

        mitigation_recommendation:
          "Refresh telemetry stream"
      });
    }

    // =====================================
    // RAPID RISK DROP
    // =====================================

    if (
      previousState &&
      previousState.final_score -
      currentState.final_score > 60
    ) {

      anomalies.push({

        anomaly_type:
          "ABNORMAL_RISK_DROP",

        anomaly_reason:
          "Risk dropped unrealistically fast",

        confidence_impact:
          "HIGH",

        mitigation_recommendation:
          "Check signal propagation consistency"
      });
    }

    // =====================================
    // PROPAGATION ANOMALY
    // =====================================

    if (
      currentState.behavior ===
      "ESCALATING" &&
      currentState.final_level ===
      "LOW"
    ) {

      anomalies.push({

        anomaly_type:
          "ABNORMAL_PROPAGATION",

        anomaly_reason:
          "Escalation behavior inconsistent with LOW state",

        confidence_impact:
          "MEDIUM",

        mitigation_recommendation:
          "Re-evaluate transition engine"
      });
    }

    return anomalies;
  }
}

module.exports =
  new AnomalyEngine();