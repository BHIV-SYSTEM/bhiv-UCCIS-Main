import api from "./api";

export const getEscalations =
  async () => {
    const response = await api.get(
      "/escalations"
    );

    return response.data;
  };

export const getEscalationById =
  async (id) => {
    const response = await api.get(
      `/escalations/${id}`
    );

    return response.data;
  };

export const createEscalation =
  async (payload) => {
    const response = await api.post(
      "/escalations",
      payload
    );

    return response.data;
  };