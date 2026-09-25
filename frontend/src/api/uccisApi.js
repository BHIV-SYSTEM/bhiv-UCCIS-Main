import axios from "axios";

const BASE = "http://localhost:5000";

export const getIntelligence = () =>
  axios.get(`${BASE}/memory`);

export const runCycle = (payload) =>
  axios.post(`${BASE}/intelligence/evaluate`, payload);

export const runExecution = (payload) =>
  axios.post(`${BASE}/execute/request`, payload);