const fs = require("fs");

const {
  CONCURRENCY_PATH
} = require("../config/constants");

const deterministicSort = require(
  "../utils/deterministicSort"
);

const {
  detectCollision
} = require("./collisionService");

const {
  isSessionStale
} = require(
  "./operatorSessionService"
);

function appendConcurrency(event) {
  fs.appendFileSync(
    CONCURRENCY_PATH,
    JSON.stringify(event) + "\n"
  );
}

function readConcurrency() {
  if (!fs.existsSync(CONCURRENCY_PATH)) {
    return [];
  }

  const data = fs.readFileSync(
    CONCURRENCY_PATH,
    "utf-8"
  );

  return data
    .split("\n")
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

function getConcurrency(traceId) {
  let events = readConcurrency();

  events = events.filter(
    event => event.trace_id === traceId
  );

  return deterministicSort(events);
}

function validateConcurrency(traceId) {
  const events = getConcurrency(traceId);

  const collisions = [];

  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {

      const collision = detectCollision(
        events[i],
        events[j]
      );

      if (collision) {
        collisions.push({
          first_operator:
            events[i].operator_id,

          second_operator:
            events[j].operator_id,

          conflicting_state:
            events[i].state
        });
      }
    }
  }

  return {
    success: true,
    total_events: events.length,
    collisions_detected: collisions.length,
    collisions
  };
}

function reconstructConcurrency(traceId) {
  const events = getConcurrency(traceId);

  return {
    trace_id: traceId,
    reconstructed_concurrency: events
  };
}

function operatorConsistency(traceId) {
  const events = getConcurrency(traceId);

  const staleSessions = [];

  events.forEach(event => {
    if (
      isSessionStale(event.last_heartbeat)
    ) {
      staleSessions.push({
        operator_id: event.operator_id,
        state: event.state
      });
    }
  });

  return {
    success: true,
    stale_sessions: staleSessions
  };
}

module.exports = {
  appendConcurrency,
  readConcurrency,
  getConcurrency,
  validateConcurrency,
  reconstructConcurrency,
  operatorConsistency
};