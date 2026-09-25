exports.calculateRisk = (zone) => {
  const trafficRisk = (zone.traffic * 0.6) + (zone.violations * 5);
  const waterRisk = (100 - zone.water_supply);
  const wasteRisk = zone.waste_level;
  const complaintRisk = zone.complaints * 10;

  let total =
    (trafficRisk * 0.4) +
    (waterRisk * 0.2) +
    (wasteRisk * 0.2) +
    (complaintRisk * 0.2);

  return Math.min(100, Math.floor(total));
};