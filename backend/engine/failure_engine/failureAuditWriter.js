const fs = require("fs");
const path = require("path");

function writeFailureAudit(error) {

  const auditDir =
    path.join(
      __dirname,
      "../../storage/audit/failures"
    );

  if (!fs.existsSync(auditDir)) {

    fs.mkdirSync(auditDir, {
      recursive: true
    });

  }

  const filePath =
    path.join(
      auditDir,
      `${Date.now()}.json`
    );

  fs.writeFileSync(
    filePath,
    JSON.stringify(error, null, 2)
  );

  return filePath;
}

module.exports =
writeFailureAudit;