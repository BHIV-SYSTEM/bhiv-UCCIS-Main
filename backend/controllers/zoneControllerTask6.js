const {
  calculateRiskScore,
  calculateConfidenceScore
} = require("../services/riskEngine");

const memory = require("../memory/memoryStore");
const { classifyState, getDecision } = require("../services/stateClassifier");

const {
  shouldTriggerExecution
} = require("../execution/executionGate");

const { consumeSignal } = require("../signal/signalConsumer");

const {
  validateSignal,
  validateIntelligence,
  schemaError
} = require("../validators/contractValidator");

function getZoneIntelligence(req, res) {
  try {

    // 📡 STEP 1: SIGNAL CONSUMPTION
    const signal = consumeSignal(req.body);

    // ❌ SIGNAL CONTRACT VALIDATION
    if (!validateSignal(signal)) {
      return res.status(400).json(schemaError());
    }

    const data = signal.payload || signal.data;

    // 🧠 INTELLIGENCE COMPUTATION
    const risk_score = calculateRiskScore(data);
    const confidence_score = calculateConfidenceScore(data);

    const current_state = classifyState(risk_score);
    const decision = getDecision(current_state);

    const history = memory.getZoneHistory(signal.zone_id);

    const previous_state =
      history.length > 0
        ? history[history.length - 1].current_state
        : null;

    const snapshot = {
      trace_id: signal.trace_id,
      zone_id: signal.zone_id,
      timestamp: signal.timestamp,

      previous_state,
      current_state,

      risk_score,
      confidence_score,
      decision
    };

    // ❌ INTELLIGENCE CONTRACT VALIDATION
    if (!validateIntelligence(snapshot)) {
      return res.status(400).json(schemaError());
    }

    // 💾 MEMORY STORE
    memory.addSnapshot(snapshot);

    // 🚨 EXECUTION PIPELINE
    const execution = shouldTriggerExecution(snapshot);

    res.json({
      ...snapshot,
      execution_triggered: execution
    });

  } catch (err) {
    return res.status(500).json(schemaError());
  }
}

module.exports = {
  getZoneIntelligence
};