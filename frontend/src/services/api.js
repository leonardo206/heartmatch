import axios from 'axios';
import storage from '../utils/storage';
import { currentConfig } from '../config/config';

const API_BASE_URL = currentConfig.apiUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.getItemAsync('userToken');
      console.log('🔐 API Interceptor - Token exists:', !!token);
      console.log('🔐 API Interceptor - Request URL:', config.url);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔐 API Interceptor - Authorization header set');
      } else {
        console.log('⚠️ API Interceptor - No token found');
      }
    } catch (error) {
      console.error('❌ API Interceptor - Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      storage.deleteItemAsync('userToken');
      storage.deleteItemAsync('userData');
    }
    return Promise.reject(error);
  }
);

export default api;