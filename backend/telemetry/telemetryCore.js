// backend/telemetry/telemetryCore.js

function telemetry() {

  return {

    cpu:
      Math.floor(
        Math.random() * 100
      ),

    memory:
      Math.floor(
        Math.random() * 100
      ),

    nodes:
      Math.floor(
        Math.random() * 20
      ),

    staleTelemetry:
      Math.random() > 0.5,

    delayedAcknowledgement:
      Math.random() > 0.5,

    runtime:
      "HEALTHY"

  };

}

module.exports = telemetry;