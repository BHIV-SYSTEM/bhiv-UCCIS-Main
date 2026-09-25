exports.calculateComplaintRisk = (zone) => {
  const complaints = zone.complaints;

  let risk = complaints * 10;

  return Math.min(100, Math.max(0, Math.floor(risk)));
};