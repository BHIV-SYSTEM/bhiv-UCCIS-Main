const signalSchema = require("../contracts/signal.schema");
const intelligenceSchema = require("../contracts/intelligence.schema");
const executionSchema = require("../contracts/execution.schema");

// ---------------- SIGNAL VALIDATION ----------------
function validateSignal(signal) {
  for (let field of signalSchema.required) {
    if (!signal[field]) {
      return false;
    }
  }

  for (let field of signalSchema.payload_required) {
    if (!signal.payload?.[field]) {
      return false;
    }
  }

  return true;
}

// ---------------- INTELLIGENCE VALIDATION ----------------
function validateIntelligence(data) {
  for (let field of intelligenceSchema.required) {
    if (!data[field]) return false;
  }

  if (!intelligenceSchema.valid_states.includes(data.current_state)) {
    return false;
  }

  if (!intelligenceSchema.valid_decisions.includes(data.decision)) {
    return false;
  }

  return true;
}

// ---------------- EXECUTION VALIDATION ----------------
function validateExecution(exec) {
  for (let field of executionSchema.required) {
    if (!exec[field]) return false;
  }

  return true;
}

// ---------------- ERROR FORMAT ----------------
function schemaError() {
  return {
    status: "error",
    error_code: "INVALID_SCHEMA"
  };
}

module.exports = {
  validateSignal,
  validateIntelligence,
  validateExecution,
  schemaError
};