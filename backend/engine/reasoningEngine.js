function generateReasoning(data, risk) {
  return {
    summary:
      risk.level === "HIGH"
        ? "Urban stress detected across multiple domains"
        : "Normal urban conditions",

    breakdown: data.map((d) => ({
      factor: d.domain,
      value: d.value,
      impact: d.value > 70 ? "HIGH" : "LOW",
    })),
  };
}

module.exports = { generateReasoning };