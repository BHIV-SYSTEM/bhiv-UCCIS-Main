const Escalation =
require("../../models/Escalation");

exports.create =
async payload => {

  const escalation =
    await Escalation.create({

      escalationId:
        `ESC-${Date.now()}`,

      incidentId:
        payload.incidentId,

      traceId:
        payload.traceId,

      priority:
        payload.priority,

      assignedTo:
        payload.assignedTo || "Unassigned",

      status:
        "Open",

      createdAt:
        new Date()
    });

  return escalation;
};

exports.findAll =
async () => {

  return await Escalation.find()
    .sort({ createdAt: -1 });

};

exports.findById =
async id => {

  return await Escalation.findById(id);

};

exports.updateStatus =
async (id, status) => {

  return await Escalation.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

};

exports.delete =
async id => {

  return await Escalation.findByIdAndDelete(id);

};