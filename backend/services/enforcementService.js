const fs = require("fs");

const {
  ENFORCEMENT_PATH
} = require("../config/constants");

const deterministicSort = require(
  "../utils/deterministicSort"
);

const {
  validateGovernanceBoundary
} = require(
  "./governanceBoundaryService"
);

function appendEnforcement(event) {
  fs.appendFileSync(
    ENFORCEMENT_PATH,
    JSON.stringify(event) + "\n"
  );
}

function readEnforcement() {
  if (!fs.existsSync(ENFORCEMENT_PATH)) {
    return [];
  }

  const data = fs.readFileSync(
    ENFORCEMENT_PATH,
    "utf-8"
  );

  return data
    .split("\n")
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

function getEnforcement(traceId) {
  let events = readEnforcement();

  events = events.filter(
    event => event.trace_id === traceId
  );

  return deterministicSort(events);
}

function validateBoundary(traceId) {
  const events = getEnforcement(traceId);

  const violations = [];

  events.forEach(event => {
    const valid =
      validateGovernanceBoundary(
        event.action
      );

    if (!valid) {
      violations.push({
        action: event.action,
        trace_id: event.trace_id
      });
    }
  });

  return {
    success: violations.length === 0,
    violations
  };
}

function reconstructEnforcement(
  traceId
) {
  const events = getEnforcement(traceId);

  return {
    trace_id: traceId,
    reconstructed_enforcement: events
  };
}

module.exports = {
  appendEnforcement,
  readEnforcement,
  getEnforcement,
  validateBoundary,
  reconstructEnforcement
};