const Escalation = require("../models/Escalation");

exports.getEscalations = async (req, res) => {
  const data = await Escalation.find();
  res.json(data);
};

exports.createEscalation = async (req, res) => {
  const data = await Escalation.create(req.body);
  res.json(data);
};

exports.deleteEscalation = async (req, res) => {
  await Escalation.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Escalation Deleted"
  });
};