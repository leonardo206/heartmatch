import axios from 'axios';
import storage from '../utils/storage';

const API_BASE_URL = 'http://localhost:3001/api';

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
    console.log('Making registration request to:', `${API_BASE_URL}/auth/register`);
    console.log('Registration data:', userData);
    const response = await api.post('/auth/register', userData);
    console.log('Registration response:', response);
    return response.data;
  } catch (error) {
    console.error('Registration error details:', error);
    console.error('Error response:', error.response);
    throw new Error(error.response?.data?.message || error.response?.data?.error || 'Errore durante la registrazione');
  }
};

export const loginUser = async (email, password) => {
  try {
    console.log('Making request to:', `${API_BASE_URL}/auth/login`);
    console.log('Request data:', { email, password });
    const response = await api.post('/auth/login', { email, password });
    console.log('Response received:', response);
    return response.data;
  } catch (error) {
    console.error('Login error details:', error);
    console.error('Error response:', error.response);
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
