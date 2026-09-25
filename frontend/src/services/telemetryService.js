import api from "./api";

export const getTelemetry = async () => {

  const response =
    await api.get("/telemetry");

  return response.data;
};