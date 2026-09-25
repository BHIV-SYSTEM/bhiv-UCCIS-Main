// failure/replayIntegrityChecker.js

class ReplayIntegrityChecker {

  validate(replay) {

    if (!replay) {

      return {

        corrupted: true,

        type:
          "REPLAY_CORRUPTION",

        reason:
          "Replay snapshot missing",

        recovery:
          "Restore replay journal"
      };
    }

    return {

      corrupted: false
    };
  }
}

module.exports =
  new ReplayIntegrityChecker();