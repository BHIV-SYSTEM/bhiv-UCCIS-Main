function visualizeTransitions(events) {

  return events.map((event) => {

    return {

      stage:
        event.stage,

      state:
        event.state,

      timestamp:
        event.timestamp
    };

  });
}

module.exports =
visualizeTransitions;