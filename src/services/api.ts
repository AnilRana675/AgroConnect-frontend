import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API configuration
const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 seconds to accommodate backend plant identification process
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }

    if (error.code === 'ECONNABORTED') {
      console.error(
        'Request timeout - the plant identification process may take longer than expected',
      );
      // Enhance the error message for plant identification timeouts
      if (error.config?.url?.includes('/plant/identify')) {
        error.message =
          'Plant identification timed out. Please try again with a clearer image or check your internet connection.';
      }
    }

    return Promise.reject(error);
  },
);

export default api;
