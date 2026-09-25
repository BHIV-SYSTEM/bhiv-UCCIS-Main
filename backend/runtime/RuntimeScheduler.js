const RuntimeEngineTask36 =
  require("./RuntimeEngineTask36");

class RuntimeScheduler {
  start() {
    console.log(
      "Runtime Scheduler Started"
    );

    setInterval(() => {
      const runtimes =
        RuntimeEngineTask36.getAllRuntimeEvents();

      runtimes.forEach(runtime => {
        if (
          runtime.state ===
          "SIGNAL_RECEIVED"
        ) {
          RuntimeEngineTask36.transition(
            runtime.traceId,
            "TELEMETRY"
          );
        }
      });
    }, 5000);

    setInterval(() => {
      const runtimes =
        RuntimeEngineTask36.getAllRuntimeEvents();

      runtimes.forEach(runtime => {
        if (
          runtime.state ===
          "TELEMETRY_PROCESSED"
        ) {
          RuntimeEngineTask36.transition(
            runtime.traceId,
            "INCIDENT"
          );
        }
      });
    }, 8000);

    setInterval(() => {
      const runtimes =
        RuntimeEngineTask36.getAllRuntimeEvents();

      runtimes.forEach(runtime => {
        if (
          runtime.state ===
          "INCIDENT_CREATED"
        ) {
          RuntimeEngineTask36.transition(
            runtime.traceId,
            "ESCALATION"
          );
        }
      });
    }, 12000);
  }
}

module.exports =
  new RuntimeScheduler();