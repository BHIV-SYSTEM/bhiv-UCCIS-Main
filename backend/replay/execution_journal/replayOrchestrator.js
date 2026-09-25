const writeExecutionJournal =
require("./journalWriter");

const replayEngine =
require("./replayEngine");

const createSnapshot =
require("./snapshotEngine");

function replayOrchestrator(events) {

  events.forEach((event) => {

    writeExecutionJournal(event);

  });

  const replayResult =
    replayEngine(events);

  const snapshot =
    createSnapshot(
      events[0].trace_id,
      replayResult
    );

  return {

    replay:
      replayResult,

    snapshot
  };
}

module.exports =
replayOrchestrator;