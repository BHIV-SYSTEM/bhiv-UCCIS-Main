class ProvenanceEngine {
  build(signal) {
    return {
      traceId:
        signal.traceId,

      source:
        signal.source,

      createdAt:
        signal.createdAt,

      evidenceChain: [
        {
          step:
            "Signal Generated",

          timestamp:
            new Date()
        },
        {
          step:
            "Signal Enriched",

          timestamp:
            new Date()
        }
      ]
    };
  }
}

module.exports =
  new ProvenanceEngine();