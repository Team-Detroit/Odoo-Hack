import axios from 'axios';
import type { AxiosInstance, AxiosError, AxiosResponse } from 'axios';
import { AUTH_TOKEN_KEY } from '../constants/routes';

const getApiUrl = (): string => {
  if (typeof window !== 'undefined') {
    const host = window.location.host;
    if (host.includes('-5173.')) {
      return `https://${host.replace('-5173.', '-5000.')}/api`;
    }
  }
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      if (!window.location.pathname.toLowerCase().includes('customer-display')) {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
