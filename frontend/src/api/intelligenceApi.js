import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const getZoneIntelligence = async (zone_id) => {
  const response = await axios.get(
    `${BASE_URL}/zone/intelligence?zone_id=${zone_id}`
  );
  return response.data;
};