class EnrichmentEngine {
  enrich(signal) {
    return {
      ...signal,

      intelligence: {
        confidence:
          Math.floor(
            Math.random() * 20
          ) + 80,

        category:
          signal.severity ===
          "Critical"
            ? "Threat"
            : "Operational",

        riskScore:
          Math.floor(
            Math.random() * 100
          )
      },

      enrichedAt:
        new Date().toISOString()
    };
  }
}

module.exports =
  new EnrichmentEngine();