const ReplaySessionTask28 =
require("../models/ReplaySessionTask28");

exports.generateReplay =
async(approvalId) => {

  const replay = {
    approvalId,
    generatedAt: new Date(),
    replayStatus: "SUCCESS"
  };

  return await ReplaySessionTask28.create({
    approval_id: approvalId,
    replay_json: replay
  });
};