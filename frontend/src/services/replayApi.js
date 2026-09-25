import api from "./api";

export const getReplays =
  async () => {
    const response = await api.get(
      "/replay"
    );

    return response.data;
  };

export const executeReplay =
  async (traceId) => {
    const response = await api.post(
      "/replay",
      {
        traceId
      }
    );

    return response.data;
  };