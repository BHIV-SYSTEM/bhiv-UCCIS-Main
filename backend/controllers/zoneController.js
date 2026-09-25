// 🔹 DATA SOURCES
const { getTrafficData } = require("../data_sources/trafficData");
const { getCivicData } = require("../data_sources/civicData");
const { normalizeData } = require("../data_sources/dataNormalizer");

// 🔹 SIGNAL LAYER
const { generateSignal } = require("../signal/tantraConnector");

// 🔹 INTELLIGENCE
const { calculateRisk } = require("../intelligence/riskEngine");
const { predictNext } = require("../intelligence/predictionEngine");
const { generateExecutionRequest } = require("../intelligence/decisionEngine");
const { generateReason } = require("../intelligence/reasonEngine");

// 🔹 SNAPSHOT (MEMORY)
const { createSnapshot } = require("../intelligence/snapshotEngine");
const { saveSnapshot } = require("../storage/snapshotStore");

// 🔹 TANTRA HOOK
const axios = require("axios");


// =====================================================
// ✅ MAIN API — FULL INTELLIGENCE PIPELINE
// =====================================================
exports.getZones = async (req, res) => {
  try {
    // 🔹 1. FETCH DATA
    const trafficData = getTrafficData();
    const civicData = getCivicData();

    // 🔹 2. NORMALIZE DATA
    const normalized = normalizeData(trafficData, civicData);

    // 🔹 3. SIGNAL (trace_id originates here)
    const signal = generateSignal(normalized);

    // 🔹 4. PROCESS THROUGH INTELLIGENCE ENGINE
    const processed = signal.payload.map(zone => {

      const risk = calculateRisk(zone);
      const prediction = predictNext(zone.history);
      const execution_request = generateExecutionRequest(risk);
      const reason = generateReason(zone, risk);

      // 🔥 PHASE 6 — TANTRA HOOK (ONLY REQUEST, NO EXECUTION)
      if (execution_request.action !== "NONE") {
        axios.post("http://localhost:5000/api/execution/request", {
          trace_id: signal.trace_id,
          zone_id: zone.zone_id,
          action: execution_request.action,
          domain: getDominantDomain(zone)
        }).catch(err => {
          console.error("Execution request failed:", err.message);
        });
      }

      return {
        zone_id: zone.zone_id,
        zone_name: zone.zone_name || ("Zone " + zone.zone_id),

        // 🔹 INTELLIGENCE OUTPUT
        risk_score: risk,
        prediction: prediction,
        execution_request: execution_request,
        reason: reason,

        // 🔹 TRACE FLOW (UNCHANGED)
        trace_id: signal.trace_id
      };
    });

    // 🔥 PHASE 8 — SNAPSHOT CREATION
    const snapshot = createSnapshot(signal, processed, normalized);

    // 🔥 STORE SNAPSHOT (MEMORY)
    saveSnapshot(snapshot);

    // 🔹 FINAL RESPONSE
    res.json(processed);

  } catch (error) {
    console.error("Error in getZones:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// =====================================================
// 🧪 RAW DATA API (DEBUG / NORMALIZED VIEW)
// =====================================================
exports.getRawZones = (req, res) => {
  try {
    const trafficData = getTrafficData();
    const civicData = getCivicData();

    const normalized = normalizeData(trafficData, civicData);

    res.json(normalized);

  } catch (error) {
    console.error("Error in getRawZones:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// =====================================================
// 🧠 HELPER — DOMAIN DETECTION (FOR TANTRA)
// =====================================================
function getDominantDomain(zone) {

  if (zone.traffic > 70 || zone.violations > 5) {
    return "traffic";
  }

  if (zone.water_supply < 50) {
    return "water";
  }

  if (zone.waste_level > 70) {
    return "waste";
  }

  if (zone.complaints > 5) {
    return "complaints";
  }

  return "general";
}