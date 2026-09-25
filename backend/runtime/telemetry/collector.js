const metrics =
require("./metrics");

class TelemetryCollector {

  collect() {

    return metrics();

  }

}

module.exports =
new TelemetryCollector();