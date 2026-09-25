import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json"
  }
});

// ======================================
// TASK 4 - ZONE INTELLIGENCE
// ======================================

export const getZones = () => {
  return API.get("/zones/intelligence");
};

// ======================================
// TASK 4 - EXECUTION
// ======================================

export const triggerExecution = (data) => {
  return API.post("/execution/trigger", data);
};

export default API;