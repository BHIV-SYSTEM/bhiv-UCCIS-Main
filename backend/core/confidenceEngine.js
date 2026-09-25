function computeConfidence(signal) {
  let completeness = 100;

  const fields = [
    signal.traffic_score,
    signal.water_score,
    signal.flood_score,
    signal.waste_score,
    signal.complaint_score,
  ];

  fields.forEach((f) => {
    if (f === null || f === undefined) completeness -= 20;
  });

  let trendConsistency = 85; // deterministic placeholder
  let domainAgreement = 90;

  let confidence = (completeness + trendConsistency + domainAgreement) / 3;

  return Math.round(confidence);
}

module.exports = { computeConfidence };