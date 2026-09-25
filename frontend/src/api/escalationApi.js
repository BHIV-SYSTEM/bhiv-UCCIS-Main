import api from "./axios";

export const getEscalations =
  async () => {

    const response =
      await api.get(
        "/escalations"
      );

    return response.data;
};

export const createEscalation =
  async (data) => {

    const response =
      await api.post(
        "/escalations",
        data
      );

    return response.data;
};

export const deleteEscalation =
  async (id) => {

    const response =
      await api.delete(
        `/escalations/${id}`
      );

    return response.data;
};