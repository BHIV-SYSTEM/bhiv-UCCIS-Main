import api from "./api";

export const getSignals = async () => {
  const response = await api.get("/signals");
  return response.data;
};

export const getSignalById = async (id) => {
  const response = await api.get(
    `/signals/${id}`
  );

  return response.data;
};

export const createSignal = async (
  payload
) => {
  const response = await api.post(
    "/signals",
    payload
  );

  return response.data;
};

export const deleteSignal = async (
  id
) => {
  const response = await api.delete(
    `/signals/${id}`
  );

  return response.data;
};