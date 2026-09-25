exports.generateReason = (zone, risk) => {
  let reasons = [];

  if (zone.traffic > 70) reasons.push("High traffic");
  if (zone.violations > 5) reasons.push("Frequent violations");
  if (zone.water_supply < 50) reasons.push("Low water supply");
  if (zone.waste_level > 70) reasons.push("High waste");
  if (zone.complaints > 5) reasons.push("High complaints");

  if (risk >= 80) reasons.push("Critical condition");

  return reasons.join(", ");
};