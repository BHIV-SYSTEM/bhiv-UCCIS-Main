const zones = require("../data/zonesTask4");

const {
  movingAverage,
  getTrend,
  calculateRisk,
  getPrediction,
  getDecisionType,
  isDecisionReady
} = require("../utils/calculationsTask4");

const { saveSnapshot } = require("./snapshotService");

const {
  validateZone,
  validateZoneArray
} = require("../utils/schemaValidator");

// =====================================================
// PROCESS ALL ZONES
// =====================================================

const processZones = (trace_id, store = true) => {
  try {
    const result = zones.map((zone) => {
      const trafficAvg = movingAverage(zone.traffic);
      const violationAvg = movingAverage(zone.violations);

      const riskScore = calculateRisk(trafficAvg, violationAvg);

      return {
        zone_id: zone.zone_id,
        trace_id,

        traffic_trend: getTrend(zone.traffic),
        moving_average: trafficAvg,
        risk_score: riskScore,
        prediction: getPrediction(zone.traffic),

        decision_ready: isDecisionReady(riskScore),
        decision_type: getDecisionType(riskScore)
      };
    });

    // Validate array
    if (!validateZoneArray(result)) {
      console.error("Schema validation failed for zone array.");

      return {
        status: "error",
        error_code: "INVALID_SCHEMA"
      };
    }

    // Save snapshot
    if (store) {
      const snapshotResult = saveSnapshot(result, trace_id);

      if (snapshotResult && snapshotResult.status === "error") {
        console.error("Snapshot save failed.");

        return {
          status: "error",
          error_code: "SNAPSHOT_ERROR"
        };
      }
    }

    return result;

  } catch (err) {
    console.error("processZones Error:", err);

    return {
      status: "error",
      error_code: "SERVER_ERROR",
      message: err.message
    };
  }
};

// =====================================================
// PROCESS SINGLE ZONE
// =====================================================

const processSingleZone = (zoneId, trace_id) => {
  try {
    const allZones = processZones(trace_id, false);

    if (!Array.isArray(allZones)) {
      return allZones;
    }

    const single = allZones.find(
      (zone) => zone.zone_id === zoneId
    );

    if (!single) {
      return {
        status: "error",
        error_code: "ZONE_NOT_FOUND"
      };
    }

    if (!validateZone(single)) {
      console.error("Schema validation failed for single zone.");

      return {
        status: "error",
        error_code: "INVALID_SCHEMA"
      };
    }

    return single;

  } catch (err) {
    console.error("processSingleZone Error:", err);

    return {
      status: "error",
      error_code: "SERVER_ERROR",
      message: err.message
    };
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  processZones,
  processSingleZone
};