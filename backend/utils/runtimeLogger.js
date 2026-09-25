const fs = require("fs");
const path = require("path");

function appendLog(file, message) {

  try {

    const timestamp =
      new Date().toISOString();

    const logPath =
      path.join(
        __dirname,
        "..",
        "..",
        file
      );

    const logMessage =
      `[${timestamp}] ${message}\n`;

    /* CREATE FILE IF NOT EXISTS */

    if (!fs.existsSync(logPath)) {

      fs.writeFileSync(logPath, "");

    }

    /* APPEND LOG */

    fs.appendFileSync(
      logPath,
      logMessage
    );

  } catch (error) {

    console.log(
      "Runtime logging error:",
      error.message
    );

  }

}

module.exports = appendLog;