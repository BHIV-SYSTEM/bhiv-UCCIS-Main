const Incident =
require("../../models/Incident");

exports.create = async payload => {

  return await Incident.create({
    incidentId:
      `INC-${Date.now()}`,

    signalId:
      payload.signalId,

    severity:
      payload.severity,

    status:
      "Open",

    traceId:
      payload.traceId
  });

};

exports.findAll = async () => {
  return await Incident.find()
    .sort({ createdAt: -1 });
};