const deterministicScoring =
require("./deterministicScoring");

const detectTrend =
require("./trendEngine");

const temporalAnalysis =
require("./temporalEngine");

const determineEscalation =
require("./escalationEngine");

const detectAnomaly =
require("./anomalyEngine");

const calculateConfidence =
require("./confidenceEngine");

const historicalAwareness =
require("./historyEngine");

const propagationLogic =
require("./propagationEngine");

function processZoneIntelligence(zoneData) {

  const intelligence = [];

  zoneData.forEach((zone) => {

    const score =
      deterministicScoring(zone.metrics);

    const trend =
      detectTrend(
        score,
        zone.previous_score
      );

    const escalation =
      determineEscalation(score);

    const history =
      historicalAwareness(
        zone.history
      );

    const anomaly =
      detectAnomaly(
        score,
        history.historical_average
      );

    const confidence =
      calculateConfidence(
        Object.keys(zone.metrics).length,
        anomaly.anomaly ? 1 : 0
      );

    const propagation =
      propagationLogic(
        zone.zone,
        escalation
      );

    intelligence.push({

      zone: zone.zone,

      score,

      trend,

      escalation,

      anomaly,

      confidence,

      historical_average:
        history.historical_average,

      propagation
    });

  });

  const temporal =
    temporalAnalysis(intelligence);

  return {
    intelligence,
    temporal
  };
}

module.exports =
processZoneIntelligence;