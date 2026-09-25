import api from "./axios";

export const getEvidence =
  async () => {

    const response =
      await api.get(
        "/evidence"
      );

    return response.data;
};

export const createEvidence =
  async (data) => {

    const response =
      await api.post(
        "/evidence",
        data
      );

    return response.data;
};