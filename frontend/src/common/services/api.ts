import axios from 'axios';

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
