class SignalRuntimeEngine {

  async process(signal) {

    return {
      traceId: signal.traceId,
      source: signal.source,
      status: "SIGNAL_RECEIVED",
      timestamp: new Date()
    };

  }

}

module.exports = new SignalRuntimeEngine();