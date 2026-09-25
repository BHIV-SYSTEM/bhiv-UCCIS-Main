const RuntimeLog = require("../models/RuntimeLog");

class RuntimeService {
  static async create(replayId) {
    return await RuntimeLog.create(
      replayId,
      "Runtime replay completed"
    );
  }
}

module.exports = RuntimeService;