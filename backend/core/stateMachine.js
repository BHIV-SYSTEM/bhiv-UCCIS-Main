function getState(score) {
  if (score < 40) return "LOW";
  if (score < 70) return "MEDIUM";
  return "HIGH";
}

function transition(prev, current) {
  return prev !== current;
}

module.exports = { getState, transition };