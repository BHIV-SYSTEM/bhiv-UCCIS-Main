import api from "./axios";

export const getTelemetry =
  async () => {

    const response =
      await api.get(
        "/telemetry"
      );

    return response.data;
};

export const createTelemetry =
  async (data) => {

    const response =
      await api.post(
        "/telemetry",
        data
      );

    return response.data;
};