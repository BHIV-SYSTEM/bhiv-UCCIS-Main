function shouldTriggerExecution(snapshot) {
  const {
    trace_id,
    zone_id,
    previous_state,
    current_state,
    confidence_score
  } = snapshot;

  // 🚫 NO execution if no transition
  if (!previous_state || previous_state === current_state) {
    return false;
  }

  // 🚫 low confidence filter
  if (confidence_score < 60) {
    return false;
  }

  // 🎯 ONLY meaningful transitions
  const meaningful =
    (previous_state === "LOW" && current_state !== "LOW") ||
    (previous_state === "MEDIUM" && current_state === "HIGH") ||
    (previous_state === "LOW" && current_state === "HIGH");

  if (!meaningful) return false;

  // 📡 ONLY REQUEST (NOT EXECUTE)
  return {
    trace_id,
    zone_id,
    previous_state,
    current_state,
    reason: `${previous_state} → ${current_state}`,
    confidence_score
  };
}

module.exports = {
  shouldTriggerExecution
};