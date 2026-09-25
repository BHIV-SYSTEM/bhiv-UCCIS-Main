const replayService = require("../services/replayService");

function replayTrace(req, res) {
  const data = replayService.getReplay(
    req.params.trace_id
  );

  res.json({
    success: true,
    replay: data
  });
}

function zoneTimeline(req, res) {
  const data = replayService.getZoneTimeline(
    req.params.zone_id
  );

  res.json({
    success: true,
    timeline: data
  });
}

function reconstruct(req, res) {
  const data = replayService.reconstructTrace(
    req.params.trace_id
  );

  res.json({
    success: true,
    reconstruction: data
  });
}

module.exports = {
  replayTrace,
  zoneTimeline,
  reconstruct
};