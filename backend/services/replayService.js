const { readAllEvents } = require("./eventJournalService");
const deterministicSort = require("../utils/deterministicSort");
const { removeDuplicateEvents } = require("../utils/validator");

function getReplay(traceId) {
  let events = readAllEvents();

  events = events.filter(
    event => event.trace_id === traceId
  );

  events = removeDuplicateEvents(events);

  events = deterministicSort(events);

  return events;
}

function getZoneTimeline(zoneId) {
  let events = readAllEvents();

  events = events.filter(
    event => event.zone_id === zoneId
  );

  return deterministicSort(events);
}

function reconstructTrace(traceId) {
  const replay = getReplay(traceId);

  return {
    trace_id: traceId,
    replay_length: replay.length,
    reconstructed_state: replay
  };
}

module.exports = {
  getReplay,
  getZoneTimeline,
  reconstructTrace
};