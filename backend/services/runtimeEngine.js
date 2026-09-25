const Event = require("../models/Event");
const Trace = require("../models/Trace");
const generateTraceId = require("../utils/generateTraceId");

/**
 * Create or attach trace
 */
const ensureTrace = async (trace_id, domain) => {
  let trace = await Trace.findOne({ trace_id });

  if (!trace) {
    trace = await Trace.create({
      trace_id,
      domain,
      status: "ACTIVE",
      event_count: 0
    });
  }

  return trace;
};

/**
 * INGEST EVENT (CORE ENTRY POINT)
 */
const ingestEvent = async (data) => {
  const trace_id = data.trace_id || generateTraceId();

  const event = await Event.create({
    ...data,
    trace_id,
    updated_at: new Date()
  });

  const trace = await ensureTrace(trace_id, data.domain);

  trace.event_count += 1;
  trace.updated_at = new Date();
  await trace.save();

  return event;
};

/**
 * GET FULL TIMELINE (RECONSTRUCTION ENGINE)
 */
const getTimeline = async (trace_id) => {
  return await Event.find({ trace_id }).sort({ created_at: 1 });
};

/**
 * FILTER EVENTS (HISTORICAL ENGINE)
 */
const getEvents = async (filters) => {
  return await Event.find(filters).sort({ created_at: -1 });
};

/**
 * ACTIVE OPERATIONS SNAPSHOT
 */
const getActiveOps = async () => {
  return await Event.aggregate([
    { $match: { status: "ACTIVE" } },
    {
      $group: {
        _id: "$event_type",
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = {
  ingestEvent,
  getTimeline,
  getEvents,
  getActiveOps
};