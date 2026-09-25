function computeRisk(data) {
  let score = 0;

  data.forEach((d) => {
    if (d.domain === "rain" && d.value > 70) score += 40;
    if (d.domain === "traffic" && d.value > 60) score += 20;
    if (d.domain === "aqi" && d.value > 100) score += 30;
    if (d.domain === "complaints" && d.value > 50) score += 10;
  });

  return {
    score,
    level: score > 80 ? "HIGH" : score > 50 ? "MEDIUM" : "LOW",
  };
}

module.exports = { computeRisk };