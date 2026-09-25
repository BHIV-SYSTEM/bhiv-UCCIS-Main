function assembleReplay(events) {

  return {

    signal:
      events.find(
        e => e.stage === "SIGNAL"
      ),

    intelligence:
      events.find(
        e => e.stage === "INTELLIGENCE"
      ),

    governance:
      events.find(
        e => e.stage === "GOVERNANCE"
      ),

    execution:
      events.find(
        e => e.stage === "EXECUTION"
      ),

    resolution:
      events.find(
        e => e.stage === "RESOLUTION"
      )
  };
}

module.exports =
assembleReplay;