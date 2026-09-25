const RuntimeEngine =
  require("../../runtime/RuntimeEngine");

class ReplayService {
  replayTrace(traceId) {
    return RuntimeEngine.getRuntime(
      traceId
    );
  }

  replayAll() {
    return RuntimeEngine
      .getAllRuntimeEvents();
  }
}

module.exports =
  new ReplayService();