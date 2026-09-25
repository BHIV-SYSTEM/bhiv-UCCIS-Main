import api from "./api";

export const getReplays =
async () => {

  const response =
    await api.get(
      "/replays"
    );

  return response.data;
};