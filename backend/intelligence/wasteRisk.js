exports.calculateWasteRisk = (zone) => {
  const waste = zone.waste_level || 50; // default
  const complaints = zone.complaints;

  let risk = (waste * 0.7) + (complaints * 3);

  return Math.min(100, Math.max(0, Math.floor(risk)));
};