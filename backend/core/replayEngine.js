const Event = require("../models/Event");

async function reconstructReplay() {

  const events = await Event.find()
    .sort({ timestamp: 1 });

  let state = {
    signals: 0,
    escalations: 0
  };

  let timeline = [];

  events.forEach((event) => {

    if (event.type === "SIGNAL") {
      state.signals++;
    }

    if (event.type === "ESCALATION") {
      state.escalations++;
    }

    timeline.push({
      event,
      snapshot: { ...state }
    });

  });

  return {
    state,
    timeline
  };
}

module.exports = {
  reconstructReplay
};