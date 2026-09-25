const { task34DB } = require("../config/db");

exports.getEscalations = async () => {
  return {
    totalEscalations: 12,
    pendingEscalations: 5,
    resolvedEscalations: 7
  };
};

exports.createEscalation = async (data) => {
  return {
    message: "Escalation Created",
    escalation: data
  };
};