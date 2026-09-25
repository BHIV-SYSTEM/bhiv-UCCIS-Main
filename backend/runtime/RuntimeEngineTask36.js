const TraceGenerator = require("./TraceGenerator");
const StateManager = require("./StateManager");
const EventProcessor = require("./EventProcessor");

class RuntimeEngineTask36 {
  constructor() {
    this.events = [];
  }

  createRuntimeSignal(signalData) {
    const traceId =
      TraceGenerator.generateTraceId();

    const signalId =
      TraceGenerator.generateSignalId();

    const runtimeEvent = {
      traceId,
      signalId,

      payload: signalData,

      state: "SIGNAL_RECEIVED",

      createdAt: new Date(),

      timeline: [
        {
          state: "SIGNAL_RECEIVED",
          timestamp: new Date()
        }
      ]
    };

    this.events.push(runtimeEvent);

    StateManager.create(
      traceId,
      "SIGNAL_RECEIVED"
    );

    return runtimeEvent;
  }

  transition(traceId, eventType) {
    const runtime =
      this.events.find(
        item => item.traceId === traceId
      );

    if (!runtime) {
      return null;
    }

    const updated =
      EventProcessor.process(
        traceId,
        eventType
      );

    runtime.state =
      updated.currentState;

    runtime.timeline.push({
      state: updated.currentState,
      timestamp: new Date()
    });

    return runtime;
  }

  getRuntime(traceId) {
    return this.events.find(
      item => item.traceId === traceId
    );
  }

  getAllRuntimeEvents() {
    return this.events;
  }

  getRuntimeHealth() {
    return {
      runtimeHealth: 98,
      activeEvents: this.events.length,
      throughput: 412,
      latency: 118,
      errors: 1,
      serviceStatus: "Healthy",
      dependencyStatus: "Healthy"
    };
  }
}

module.exports = new RuntimeEngineTask36();