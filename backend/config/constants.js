const path = require("path");

module.exports = {
  JOURNAL_PATH: path.join(
    __dirname,
    "../data/journal/events.log"
  ),

  LIFECYCLE_PATH: path.join(
    __dirname,
    "../data/journal/lifecycle.log"
  ),

  CONCURRENCY_PATH: path.join(
    __dirname,
    "../data/journal/concurrency.log"
  ),

  ENFORCEMENT_PATH: path.join(
    __dirname,
    "../data/journal/enforcement.log"
  ),

  FAILURE_PATH: path.join(
    __dirname,
    "../data/journal/failure.log"
  ),

  RECOVERY_PATH: path.join(
    __dirname,
    "../data/journal/recovery.log"
  )
};