function computeRisk(d) {
  return (
    d.traffic * 0.25 +
    d.water * 0.2 +
    d.flood * 0.25 +
    d.waste * 0.15 +
    d.complaint * 0.15
  );
}

function getState(risk) {
  if (risk < 30) return "LOW";
  if (risk < 70) return "MEDIUM";
  return "HIGH";
}

module.exports = { computeRisk, getState };