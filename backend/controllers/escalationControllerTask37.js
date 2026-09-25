const EscalationTask37 =
  require("../models/EscalationTask37");

exports.getEscalations =
  async (req, res) => {
    const escalations =
      await EscalationTask37.find();

    res.json(escalations);
  };

exports.createEscalation =
  async (req, res) => {
    const escalation =
      await EscalationTask37.create(
        req.body
      );

    res.status(201).json(
      escalation
    );
  };