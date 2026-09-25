function buildTimeline(events) {

  return events.sort((a, b) => {

    return (
      new Date(a.timestamp) -
      new Date(b.timestamp)
    );

  });
}

module.exports =
buildTimeline;