const Evidence =
  require("../models/Evidence");

class EvidenceEngine {

  async collect(replay) {

    const evidence =
      await Evidence.create({
        evidenceId: `EVD-${Date.now()}`,
        traceId: replay.traceId,
        replayId: replay.replayId,
        fileName: "runtime-log.txt",
        fileType: "text",
        storagePath: "/evidence"
      });

    return evidence;
  }

}

module.exports =
  new EvidenceEngine();