function removeDuplicateEvents(events) {
  const seen = new Set();

  return events.filter(event => {
    if (seen.has(event.event_id)) {
      return false;
    }

    seen.add(event.event_id);
    return true;
  });
}

module.exports = {
  removeDuplicateEvents
};