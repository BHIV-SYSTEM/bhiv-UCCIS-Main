class ConfidenceEngine {

  calculate({
    currentState,
    previousState,
    anomalies,
    domains
  }) {

    let confidence = 100;

    const reasons = [];

    // =====================================
    // SIGNAL FRESHNESS
    // =====================================

    const now = Date.now();

    const age =
      now - currentState.timestamp;

    if (age > 60000) {

      confidence -= 20;

      reasons.push(
        "Telemetry freshness degraded"
      );
    }

    // =====================================
    // MISSING DATA
    // =====================================

    const requiredDomains = [
      "traffic",
      "flooding",
      "water_shortage",
      "waste_overload",
      "complaints"
    ];

    requiredDomains.forEach(domain => {

      if (!domains[domain]) {

        confidence -= 10;

        reasons.push(
          `Missing domain data: ${domain}`
        );
      }
    });

    // =====================================
    // ANOMALY IMPACT
    // =====================================

    if (anomalies.length > 0) {

      confidence -=
        anomalies.length * 10;

      reasons.push(
        "Detected intelligence anomalies"
      );
    }

    // =====================================
    // HISTORICAL CONSISTENCY
    // =====================================

    if (previousState) {

      const difference =
        Math.abs(
          previousState.final_score -
          currentState.final_score
        );

      if (difference > 40) {

        confidence -= 15;

        reasons.push(
          "Historical consistency weakened"
        );
      }
    }

    // =====================================
    // CONFLICT SEVERITY
    // =====================================

    const influenced =
      currentState.influenced_domains;

    let highCount = 0;

    Object.keys(influenced)
      .forEach(domain => {

        if (
          influenced[domain].level ===
          "HIGH"
        ) {

          highCount++;
        }
      });

    if (highCount >= 3) {

      confidence -= 10;

      reasons.push(
        "High multi-domain conflict severity"
      );
    }

    // =====================================
    // FLOOR LIMIT
    // =====================================

    if (confidence < 0) {

      confidence = 0;

    }

    return {

      confidence_score:
        confidence,

      confidence_reasoning:
        reasons
    };
  }
}

module.exports =
  new ConfidenceEngine();