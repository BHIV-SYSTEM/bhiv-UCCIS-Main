import api from "../api/axios";

// ==========================================
// TASK 33 - RUNTIME SUMMARY
// ==========================================
export const getRuntimeSummary = async () => {
  const response = await api.get(
    "/v2/task33/runtime/summary"
  );

  return response.data;
};

// ==========================================
// TASK 33 - TRACE IDS
// ==========================================
export const getTraceIds = async () => {
  const response = await api.get(
    "/v2/task33/runtime/trace-ids"
  );

  return response.data;
};

// ==========================================
// TASK 33 - HEALTH
// ==========================================
export const getHealth = async () => {
  const response = await api.get(
    "/v2/task33/health"
  );

  return response.data;
};

// ==========================================
// TASK 33 - REPLAY
// ==========================================
export const getReplayData = async () => {
  const response = await api.get(
    "/v2/task33/replay"
  );

  return response.data;
};

// ==========================================
// TASK 33 - RUNTIME CHAIN
// ==========================================
export const getRuntimeChain = async (traceId) => {
  const response = await api.get(
    (`/v2/task33/runtime/chain/${encodeURIComponent(traceId)}`)
  );

  return response.data;
};