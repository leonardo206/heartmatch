import axios from 'axios';
import storage from '../utils/storage';
import { currentConfig } from '../config/config';

const API_BASE_URL = currentConfig.apiUrl;

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Errore durante la registrazione');
  }
};

export const loginUser = async (email, password) => {
  try {
    console.log('🔐 LoginUser - Making request to:', `${API_BASE_URL}/auth/login`);
    const response = await api.post('/auth/login', { email, password });
    console.log('🔐 LoginUser - Response received:', response.data);
    console.log('🔐 LoginUser - Token exists:', !!response.data.token);
    console.log('🔐 LoginUser - User data exists:', !!response.data.user);
    return response.data;
  } catch (error) {
    console.error('❌ LoginUser - Error:', error);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Errore durante il login');
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Errore nel recupero del profilo');
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Errore nell\'aggiornamento del profilo');
  }
};
