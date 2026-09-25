import api from "./api";

export const getTelemetry = async () => {
  const response = await api.get(
    "/telemetry"
  );

  return response.data;
};

export const getTelemetryById =
  async (id) => {
    const response = await api.get(
      `/telemetry/${id}`
    );

    return response.data;
  };

export const createTelemetry =
  async (payload) => {
    const response = await api.post(
      "/telemetry",
      payload
    );

    return response.data;
  };