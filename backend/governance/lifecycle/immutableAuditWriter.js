const fs = require("fs");
const path = require("path");

function immutableAuditWriter(contract) {

  const auditDir =
    path.join(
      __dirname,
      "../../storage/audit/immutable"
    );

  if (!fs.existsSync(auditDir)) {

    fs.mkdirSync(auditDir, {
      recursive: true
    });

  }

  const auditFile =
    path.join(
      auditDir,
      `${contract.execution_id}.json`
    );

  /*
    Immutable write:
    only create if not exists
  */

  if (!fs.existsSync(auditFile)) {

    fs.writeFileSync(
      auditFile,
      JSON.stringify(contract, null, 2)
    );

  }

  return auditFile;
}

module.exports =
immutableAuditWriter;