import axios from "axios";

// ======================================================
// BASE API URL
// ======================================================

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000";

console.log("======================================");
console.log("UCCIS API BASE URL:", API_BASE_URL);
console.log("======================================");

// ======================================================
// API INSTANCE
// Used for /api/* routes
// ======================================================

const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// REQUEST INTERCEPTOR
// ======================================================

API.interceptors.request.use(
  (config) => {
    console.log(
      `[API REQUEST] ${config.method?.toUpperCase()} ${
        config.baseURL
      }${config.url}`
    );

    return config;
  },
  (error) => {
    console.error(
      "[API REQUEST ERROR]",
      error
    );

    return Promise.reject(error);
  }
);

// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

API.interceptors.response.use(
  (response) => {
    console.log(
      `[API RESPONSE] ${response.status} ${response.config.url}`,
      response.data
    );

    return response;
  },
  (error) => {
    console.error(
      "[API ERROR]",
      error.response?.status,
      error.response?.data ||
        error.message
    );

    return Promise.reject(error);
  }
);

// ======================================================
// TASK 4 - GET ZONES
//
// IMPORTANT:
// Your backend uses:
//
// https://uccis-backend.onrender.com/zones
//
// NOT:
//
// https://uccis-backend.onrender.com/api/zones
// ======================================================

export const getZones = async () => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/zones`,
      {
        timeout: 15000,
        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );

    console.log(
      "======================================"
    );

    console.log(
      "[ZONES RAW RESPONSE]",
      response.data
    );

    console.log(
      "======================================"
    );

    const data = response.data;

    // --------------------------------------------------
    // Format 1:
    // [ {...}, {...} ]
    // --------------------------------------------------

    if (Array.isArray(data)) {
      return data;
    }

    // --------------------------------------------------
    // Format 2:
    // { zones: [...] }
    // --------------------------------------------------

    if (
      Array.isArray(data?.zones)
    ) {
      return data.zones;
    }

    // --------------------------------------------------
    // Format 3:
    // { data: [...] }
    // --------------------------------------------------

    if (
      Array.isArray(data?.data)
    ) {
      return data.data;
    }

    console.error(
      "[ZONES] Unexpected response format:",
      data
    );

    return [];
  } catch (error) {
    console.error(
      "[ZONES API ERROR]",
      error.response?.status,
      error.response?.data ||
        error.message
    );

    throw error;
  }
};

// ======================================================
// TASK 4 - SEND DECISION REQUEST
//
// Backend endpoint:
//
// /action/trigger
//
// NOT:
//
// /api/action/trigger
// ======================================================

export const sendDecisionRequest =
  async (request) => {
    const zoneId = Number(
      String(
        request?.zone_id ??
          request?.zoneId ??
          request?.id ??
          ""
      ).replace(
        /[^\d]/g,
        ""
      )
    );

    const body = {
      zoneId: zoneId,
      action:
        "deploy_waste_collection",
    };

    console.log(
      "======================================"
    );

    console.log(
      "[ACTION TRIGGER REQUEST]",
      body
    );

    console.log(
      "======================================"
    );

    const response =
      await axios.post(
        `${API_BASE_URL}/action/trigger`,
        body,
        {
          timeout: 15000,

          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

    console.log(
      "[ACTION TRIGGER RESPONSE]",
      response.status,
      response.data
    );

    return response;
  };

// ======================================================
// TRIGGER EXECUTION
//
// Keep this export because other UCCIS components
// may already be using triggerExecution.
// ======================================================

export const triggerExecution =
  async (payload) => {
    console.log(
      "[TRIGGER EXECUTION]",
      payload
    );

    return axios.post(
      `${API_BASE_URL}/action/trigger`,
      payload,
      {
        timeout: 15000,

        headers: {
          "Content-Type":
            "application/json",
        },
      }
    );
  };

// ======================================================
// TASK 30 APIs
// ======================================================

export const getSignals = () =>
  API.get("/signals");

export const getTelemetry = () =>
  API.get("/telemetry");

export const getIncidents = () =>
  API.get("/incidents");

export const getEscalations = () =>
  API.get("/escalations");

export const getDecisions = () =>
  API.get("/decisions");

export const getRuntime = () =>
  API.get("/runtime");

// ======================================================
// TASK 32 APIs
// ======================================================

export const getDashboard = () =>
  API.get(
    "/v2/task32/dashboard/summary"
  );

export const getReplay = (
  traceId
) =>
  API.get(
    `/v2/task32/replay/${traceId}`
  );

export const executeSignal = (
  payload
) =>
  API.post(
    "/v2/task32/runtime/execute-signal",
    payload
  );

// ======================================================
// TASK 34 APIs
// ======================================================

export const getEvidence = () =>
  API.get("/evidence");

export const getObservability = () =>
  API.get("/observability");

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default API;