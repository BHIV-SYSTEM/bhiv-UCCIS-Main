class StateManager {
  constructor() {
    this.runtimeStates = new Map();
  }

  create(traceId, state) {
    this.runtimeStates.set(traceId, {
      traceId,
      currentState: state,
      updatedAt: new Date()
    });

    return this.runtimeStates.get(traceId);
  }

  update(traceId, state) {
    const runtime = this.runtimeStates.get(traceId);

    if (!runtime) return null;

    runtime.currentState = state;
    runtime.updatedAt = new Date();

    return runtime;
  }

  get(traceId) {
    return this.runtimeStates.get(traceId);
  }

  getAll() {
    return Array.from(this.runtimeStates.values());
  }
}

module.exports = new StateManager();