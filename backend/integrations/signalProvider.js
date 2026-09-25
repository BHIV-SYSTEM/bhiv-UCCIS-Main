const RuntimeEngine =
  require("../runtime/RuntimeEngine");

class SignalProvider {
  generateSignal() {
    const severities = [
      "Low",
      "Medium",
      "High",
      "Critical"
    ];

    const signal = {
      source: "UCCIS Runtime",

      severity:
        severities[
          Math.floor(
            Math.random() *
              severities.length
          )
        ],

      message:
        "Runtime event generated",

      timestamp:
        new Date().toISOString()
    };

    return RuntimeEngine
      .createRuntimeSignal(signal);
  }

  generateBulkSignals(count = 5) {
    const signals = [];

    for (let i = 0; i < count; i++) {
      signals.push(
        this.generateSignal()
      );
    }

    return signals;
  }
}

module.exports =
  new SignalProvider();