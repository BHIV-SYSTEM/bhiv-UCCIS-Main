const Signal =
require("../../models/Signal");

exports.create =
async payload => {

  return await Signal.create({

    signalId:
      `SIG-${Date.now()}`,

    source:
      payload.source,

    severity:
      payload.severity,

    payload:
      payload.payload

  });

};

exports.findAll =
async () => {

  return await Signal.find()
    .sort({ createdAt: -1 });

};