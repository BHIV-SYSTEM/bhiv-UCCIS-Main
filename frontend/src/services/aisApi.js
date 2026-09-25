import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const aisApi = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getAISStats = async () => {
  const response = await aisApi.get('/ais/stats');
  return response.data;
};

export const getAISData = async (params = {}) => {
  const response = await aisApi.get('/ais', { params });
  return response.data;
};

export default aisApi;
