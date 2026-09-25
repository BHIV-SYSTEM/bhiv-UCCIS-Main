function classifyState(risk) {
  if (risk < 40) return "LOW";
  if (risk < 70) return "MEDIUM";
  return "HIGH";
}

function getDecision(state) {
  if (state === "HIGH") return "ALERT";
  if (state === "MEDIUM") return "MONITOR";
  return "NORMAL";
}

module.exports = {
  classifyState,
  getDecision
};