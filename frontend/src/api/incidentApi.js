import api from "./axios";

export const getIncidents =
  async () => {

    const response =
      await api.get("/incidents");

    return response.data;
};

export const createIncident =
  async (data) => {

    const response =
      await api.post(
        "/incidents",
        data
      );

    return response.data;
};

export const deleteIncident =
  async (id) => {

    const response =
      await api.delete(
        `/incidents/${id}`
      );

    return response.data;
};