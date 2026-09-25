import axios from "axios";

const API =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const getDashboardAnalytics =
  async () => {
    const response =
      await axios.get(
        `${API}/analytics/dashboard`
      );

    return response.data;
  };

export const getObservability =
  async () => {
    const response =
      await axios.get(
        `${API}/observability`
      );

    return response.data;
  };