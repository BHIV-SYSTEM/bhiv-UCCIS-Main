const EvidenceTask37 =
  require("../models/EvidenceTask37");

exports.getEvidence =
  async (req, res) => {
    const evidence =
      await EvidenceTask37.find();

    res.json(evidence);
  };

exports.createEvidence =
  async (req, res) => {
    const evidence =
      await EvidenceTask37.create(
        req.body
      );

    res.status(201).json(
      evidence
    );
  };