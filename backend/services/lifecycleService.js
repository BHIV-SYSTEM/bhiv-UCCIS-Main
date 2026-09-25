const fs = require("fs");

const {
  LIFECYCLE_PATH
} = require("../config/constants");

const deterministicSort = require(
  "../utils/deterministicSort"
);

const {
  validateTransition
} = require(
  "./transitionValidatorService"
);

function appendLifecycle(event) {
  fs.appendFileSync(
    LIFECYCLE_PATH,
    JSON.stringify(event) + "\n"
  );
}

function readLifecycle() {
  if (!fs.existsSync(LIFECYCLE_PATH)) {
    return [];
  }

  const data = fs.readFileSync(
    LIFECYCLE_PATH,
    "utf-8"
  );

  return data
    .split("\n")
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

function getLifecycle(traceId) {
  let events = readLifecycle();

  events = events.filter(
    event => event.trace_id === traceId
  );

  return deterministicSort(events);
}

function validateLifecycle(traceId) {
  const lifecycle = getLifecycle(traceId);

  let previousState = null;

  for (const item of lifecycle) {
    const valid = validateTransition(
      previousState,
      item.state
    );

    if (!valid) {
      return {
        success: false,
        failed_state: item.state,
        previous_state: previousState
      };
    }

    previousState = item.state;
  }

  return {
    success: true,
    final_state: previousState
  };
}

function reconstructLifecycle(traceId) {
  const lifecycle = getLifecycle(traceId);

  return {
    trace_id: traceId,
    lifecycle_length: lifecycle.length,
    reconstructed_lifecycle: lifecycle
  };
}

module.exports = {
  appendLifecycle,
  readLifecycle,
  getLifecycle,
  validateLifecycle,
  reconstructLifecycle
};