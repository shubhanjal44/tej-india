import axios, { AxiosError } from 'axios';
import { retryRequest, defaultRetryCondition, getErrorMessage } from '../utils/apiEnhancements';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Extract and attach user-friendly error message
    const errorMessage = getErrorMessage(error);
    (error as any).userMessage = errorMessage;

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Don't redirect if we're already on login/register page
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    // Log errors in development
    if (import.meta.env.DEV) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: errorMessage,
      });
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function to make API calls with retry logic
 */
export const apiWithRetry = {
  get: <T = any>(url: string, config?: any) =>
    retryRequest(() => api.get<T>(url, config), { maxRetries: 2 }),

  post: <T = any>(url: string, data?: any, config?: any) =>
    api.post<T>(url, data, config), // Don't retry POST by default

  put: <T = any>(url: string, data?: any, config?: any) =>
    api.put<T>(url, data, config),

  patch: <T = any>(url: string, data?: any, config?: any) =>
    api.patch<T>(url, data, config),

  delete: <T = any>(url: string, config?: any) =>
    api.delete<T>(url, config),
};

export default api;
