const {
  processZones,
  processSingleZone
} = require("../services/intelligenceServiceTask4");

// =====================================================
// TRACE ID GENERATOR
// =====================================================

const generateTraceId = () => {
  return `TRACE_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

// =====================================================
// STANDARD ERROR RESPONSE
// =====================================================

const sendError = (res, trace_id, message = "Invalid Request", statusCode = 400) => {
  return res.status(statusCode).json({
    trace_id,
    status: "error",
    error_code: statusCode === 500 ? "SERVER_ERROR" : "INVALID_SCHEMA",
    message
  });
};

// =====================================================
// GET INTELLIGENCE FOR ALL ZONES
// =====================================================

const getZonesIntelligence = async (req, res) => {
  const trace_id = generateTraceId();

  try {
    const result = await processZones(trace_id);

    if (!result) {
      return sendError(res, trace_id, "No zone intelligence available");
    }

    return res.status(200).json({
      trace_id,
      status: "success",
      response: result
    });

  } catch (error) {
    console.error("getZonesIntelligence:", error);

    return sendError(
      res,
      trace_id,
      error.message || "Internal Server Error",
      500
    );
  }
};

// =====================================================
// GET INTELLIGENCE FOR SINGLE ZONE
// =====================================================

const getZoneIntelligence = async (req, res) => {
  const trace_id = generateTraceId();

  try {
    const { zone_id } = req.query;

    if (!zone_id) {
      return sendError(res, trace_id, "zone_id is required");
    }

    const result = await processSingleZone(zone_id, trace_id);

    if (!result) {
      return sendError(res, trace_id, "Zone not found");
    }

    return res.status(200).json({
      trace_id,
      status: "success",
      response: result
    });

  } catch (error) {
    console.error("getZoneIntelligence:", error);

    return sendError(
      res,
      trace_id,
      error.message || "Internal Server Error",
      500
    );
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getZonesIntelligence,
  getZoneIntelligence
};