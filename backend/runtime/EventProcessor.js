const runtimeConfig = require("../config/runtimeConfig");
const stateManager = require("./StateManager");

class EventProcessor {
  process(traceId, eventType) {
    let nextState = "";

    switch (eventType) {
      case "SIGNAL":
        nextState = runtimeConfig.SIGNAL;
        break;

      case "TELEMETRY":
        nextState = runtimeConfig.TELEMETRY;
        break;

      case "INCIDENT":
        nextState = runtimeConfig.INCIDENT;
        break;

      case "ESCALATION":
        nextState = runtimeConfig.ESCALATION;
        break;

      case "REPLAY":
        nextState = runtimeConfig.REPLAY;
        break;

      case "EVIDENCE":
        nextState = runtimeConfig.EVIDENCE;
        break;

      case "ANALYTICS":
        nextState = runtimeConfig.ANALYTICS;
        break;

      case "DASHBOARD":
        nextState = runtimeConfig.DASHBOARD;
        break;

      default:
        nextState = "UNKNOWN";
    }

    return stateManager.update(traceId, nextState);
  }
}

module.exports = new EventProcessor();