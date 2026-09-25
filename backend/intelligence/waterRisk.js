exports.calculateWaterRisk = (zone) => {
  const supply = zone.water_supply;   // 0–100
  const complaints = zone.complaints;

  let risk = (100 - supply) + (complaints * 2);

  return Math.min(100, Math.max(0, Math.floor(risk)));
};