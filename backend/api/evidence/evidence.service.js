const Evidence =
require("../../models/Evidence");

exports.create =
async payload => {

  return await Evidence.create({

    evidenceId:
      `EVD-${Date.now()}`,

    replayId:
      payload.replayId,

    traceId:
      payload.traceId,

    status:
      "Stored"

  });

};

exports.findAll =
async () => {

  return await Evidence.find()
    .sort({ createdAt: -1 });

};