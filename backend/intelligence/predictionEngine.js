exports.predictNext = (history) => {
  if (!history || history.length === 0) return "LOW";

  const avg = history.reduce((a, b) => a + b, 0) / history.length;

  if (avg > 80) return "HIGH";
  if (avg > 50) return "MEDIUM";
  return "LOW";
};