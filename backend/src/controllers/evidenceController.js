const Evidence = require("../models/Evidence");

exports.getEvidence = async (req, res) => {
  const evidence = await Evidence.find();

  res.json(evidence);
};

exports.createEvidence = async (req, res) => {
  const evidence = await Evidence.create(req.body);

  res.json(evidence);
};