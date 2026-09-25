const buildTimeline =
require("./timelineBuilder");

const assembleReplay =
require("./replayAssembler");

const visualizeTransitions =
require("./replayStateVisualizer");

function replayEngine(events) {

  const timeline =
    buildTimeline(events);

  const replay =
    assembleReplay(timeline);

  const visualization =
    visualizeTransitions(timeline);

  return {

    timeline,

    replay,

    visualization
  };
}

module.exports =
replayEngine;