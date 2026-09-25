import api from "./axios";

export const getReplays =
  async () => {

    const response =
      await api.get("/replays");

    return response.data;
};

export const createReplay =
  async (data) => {

    const response =
      await api.post(
        "/replays",
        data
      );

    return response.data;
};

export const runReplay =
  async (id) => {

    const response =
      await api.post(
        `/replays/run/${id}`
      );

    return response.data;
};