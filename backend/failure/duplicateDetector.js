// failure/duplicateDetector.js

const requests =
  new Set();

class DuplicateDetector {

  check(traceId) {

    if (
      requests.has(traceId)
    ) {

      return {

        duplicate: true,

        type:
          "DUPLICATE_REQUEST",

        reason:
          "Duplicate trace detected",

        recovery:
          "Generate new trace"
      };
    }

    requests.add(traceId);

    return {

      duplicate: false
    };
  }
}

module.exports =
  new DuplicateDetector();