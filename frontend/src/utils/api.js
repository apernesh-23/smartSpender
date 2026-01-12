import axios from 'axios';
import { getAuthToken } from './auth';

const API_URL =  'https://smartbackend-kappa.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('smartspender_token');
      localStorage.removeItem('smartspender_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
