const { triggerExecution } = require("../services/executionService");

// 🔥 TRACE ID GENERATOR (SERVER-SIDE ONLY)
const generateTraceId = () => {
  return "TRACE_" + Date.now() + Math.floor(Math.random() * 1000);
};

// ===============================
// 🚀 MAIN EXECUTION CONTROLLER
// ===============================
const executeAction = async (req, res) => {
  try {
    const { action, decision_type } = req.body;

    // ✅ ALWAYS generate trace_id on backend
    const trace_id = generateTraceId();

    // 🔥 trigger execution service
    await triggerExecution({
      trace_id,
      action,
      decision_type
    });

    // ✅ FINAL RESPONSE FORMAT (STRICT)
    return res.json({
      status: "success",
      response: {
        message: "Execution received successfully",
        trace_id: trace_id,
        status: "processed"
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      response: {
        message: "Execution failed",
        error: error.message
      }
    });
  }
};

// ===============================
// 📥 RECEIVER / MOCK ENDPOINT
// ===============================
const executionRequest = (req, res) => {
  console.log("📥 Execution Request Received:", req.body);

  return res.json({
    status: "success",
    response: {
      message: "Execution received successfully",
      trace_id: req.body.trace_id || "UNKNOWN_TRACE",
      status: "processed"
    }
  });
};

module.exports = {
  executeAction,
  executionRequest
};