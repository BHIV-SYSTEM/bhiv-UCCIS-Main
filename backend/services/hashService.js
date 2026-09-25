const crypto = require("crypto");

function generateHash(event) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(event))
    .digest("hex");
}

module.exports = {
  generateHash
};