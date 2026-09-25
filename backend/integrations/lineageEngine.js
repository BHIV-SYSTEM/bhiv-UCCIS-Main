class LineageEngine {
  generate(runtime) {
    return {
      traceId:
        runtime.traceId,

      lineage:
        runtime.timeline.map(
          event => ({
            state:
              event.state,

            timestamp:
              event.timestamp
          })
        )
    };
  }
}

module.exports =
  new LineageEngine();