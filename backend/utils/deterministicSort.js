function deterministicSort(events) {
  return events.sort((a, b) => {
    if (a.timestamp === b.timestamp) {
      return a.sequence - b.sequence;
    }

    return new Date(a.timestamp) - new Date(b.timestamp);
  });
}

module.exports = deterministicSort;