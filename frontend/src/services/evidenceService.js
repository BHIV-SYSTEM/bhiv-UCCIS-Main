import api from "./api";

export const getEvidence =
async () => {

  const response =
    await api.get(
      "/evidence"
    );

  return response.data;
};