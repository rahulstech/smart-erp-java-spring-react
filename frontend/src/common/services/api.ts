import axios from 'axios';
import { authStorage } from '../storages/AuthStorage';

/**
 * Standard Axios instance configured for API communication with the backend.
 * Uses a default local port fallback if no environment variable is provided.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const tokens = authStorage.getToken();
  if (tokens && tokens.authToken) {
    config.headers.Authorization = `Bearer ${tokens.authToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

