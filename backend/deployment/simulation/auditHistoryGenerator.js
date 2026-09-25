const fs = require("fs");
const path = require("path");

function auditHistoryGenerator(
  execution
) {

  const auditDir =
    path.join(
      __dirname,
      "../../storage/audit/history"
    );

  if (!fs.existsSync(auditDir)) {

    fs.mkdirSync(auditDir, {
      recursive: true
    });

  }

  const history = {

    trace_id:
      execution
      .tantra_execution
      .trace_id,

    generated_at:
      new Date(),

    execution_summary:
      execution.execution_status,

    replay_enabled: true
  };

  const filePath =
    path.join(
      auditDir,
      `${history.trace_id}.json`
    );

  fs.writeFileSync(
    filePath,
    JSON.stringify(history, null, 2)
  );

  return history;
}

module.exports =
auditHistoryGenerator;