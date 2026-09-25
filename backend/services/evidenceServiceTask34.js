const { task34DB } = require("../config/db");

exports.getEvidence = async () => {
  return {
    evidenceFiles: 32,
    verifiedEvidence: 29
  };
};

exports.createEvidence = async (data) => {
  return {
    message: "Evidence Created",
    evidence: data
  };
};