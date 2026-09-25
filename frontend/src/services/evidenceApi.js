import api from "./api";

export const getEvidence =
  async () => {
    const response = await api.get(
      "/evidence"
    );

    return response.data;
  };

export const getEvidenceById =
  async (id) => {
    const response = await api.get(
      `/evidence/${id}`
    );

    return response.data;
  };