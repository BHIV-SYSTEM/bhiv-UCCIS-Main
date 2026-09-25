const Signal =
  require("./signal.model");

const RuntimeEngine =
  require("../../runtime/RuntimeEngine");

class SignalService {
  async createSignal(data) {
    const runtime =
      RuntimeEngine.createRuntimeSignal(
        data
      );

    const signal =
      await Signal.create({
        traceId: runtime.traceId,
        signalId: runtime.signalId,
        payload: data
      });

    return signal;
  }

  async getSignals() {
    return await Signal.find()
      .sort({ createdAt: -1 });
  }

  async getSignal(traceId) {
    return await Signal.findOne({
      traceId
    });
  }
}

module.exports =
  new SignalService();