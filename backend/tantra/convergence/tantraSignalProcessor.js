function tantraSignalProcessor(signal) {

  return {

    trace_id:
      signal.trace_id,

    stage:
      "SIGNAL",

    status:
      "SIGNAL_CAPTURED",

    zone:
      signal.zone,

    domain:
      signal.domain,

    metrics:
      signal.metrics,

    timestamp:
      new Date()
  };
}

module.exports =
tantraSignalProcessor;