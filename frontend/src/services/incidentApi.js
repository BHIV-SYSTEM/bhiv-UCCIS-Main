import api from "./api";

export const getIncidents = async () => {
  const response = await api.get(
    "/incidents"
  );

  return response.data;
};

export const getIncidentById =
  async (id) => {
    const response = await api.get(
      `/incidents/${id}`
    );

    return response.data;
  };

export const createIncident =
  async (payload) => {
    const response = await api.post(
      "/incidents",
      payload
    );

    return response.data;
  };

export const updateIncident =
  async (id, payload) => {
    const response = await api.put(
      `/incidents/${id}`,
      payload
    );

    return response.data;
  };