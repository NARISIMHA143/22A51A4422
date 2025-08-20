import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export const createShortUrlApi = (url: string, validity?: number, shortcode?: string) => {
  return axios.post(`${API_BASE_URL}/shorturls`, { url, validity, shortcode });
};

export const getAllStatsApi = () => {
  return axios.get(`${API_BASE_URL}/shorturls`);
};