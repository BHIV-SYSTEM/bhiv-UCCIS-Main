const { getEvents } = require("./appendOnlyStore");

function scrubReplay(index) {

  const events = getEvents();

  return {
    replayPoint: index,
    event: events[index] || null
  };
}

module.exports = {
  scrubReplay
};