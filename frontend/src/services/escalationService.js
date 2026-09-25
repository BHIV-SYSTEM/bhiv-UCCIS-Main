import api from "./api";

export const getEscalations = async () => {

  const response =
    await api.get("/escalations");

  return response.data;
};