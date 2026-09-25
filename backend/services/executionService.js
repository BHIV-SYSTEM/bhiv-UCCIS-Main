const axios = require("axios");

const triggerExecution = async ({ trace_id, action, decision_type }) => {
  try {
    const payload = {
      trace_id,
      action,
      decision_type
    };

    // 🔥 REAL API CALL (NO LOCAL LOGIC)
    const response = await axios.post(
      "http://localhost:5000/execution/request",
      payload
    );

    // 🔥 LOG RESPONSE (MANDATORY)
    console.log("🔥 EXECUTION RESPONSE:", response.data);

    return {
      status: "success",
      response: response.data
    };

  } catch (error) {
    console.log("❌ EXECUTION FAILED:", error.message);

    return {
      status: "error",
      error: error.message
    };
  }
};

module.exports = {
  triggerExecution
};