import api from "./api";

export const getReplaySessions =
  async () => {

    const response =
      await api.get("/replay");

    return response.data;
  };