import axios from "axios";

const API =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getRuntimeEvents =
  async () => {
    const response =
      await axios.get(
        `${API}/runtime/events`
      );

    return response.data;
  };

export const createRuntime =
  async payload => {
    const response =
      await axios.post(
        `${API}/runtime/start`,
        payload
      );

    return response.data;
  };

export const getRuntimeHealth =
  async () => {
    const response =
      await axios.get(
        `${API}/health`
      );

    return response.data;
  };

export const getRuntimeMetrics =
  async () => {
    const response =
      await axios.get(
        `${API}/runtime-metrics`
      );

    return response.data;
  };