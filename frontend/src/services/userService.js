import api from './api';

export const getPotentialMatches = async (latitude, longitude, maxDistance) => {
  try {
    console.log('Calling getPotentialMatches...');
    const params = {};
    if (latitude && longitude) {
      params.latitude = latitude;
      params.longitude = longitude;
    }
    if (maxDistance) {
      params.maxDistance = maxDistance;
    }

    console.log('Request params:', params);
    const response = await api.get('/users/potential-matches', { params });
    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('getPotentialMatches error:', error);
    throw new Error(error.response?.data?.error || 'Error loading potential matches');
  }
};

export const likeUser = async (userId) => {
  try {
    const response = await api.post('/matches/like', { targetUserId: userId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error during like');
  }
};

export const passUser = async (userId) => {
  try {
    const response = await api.post('/matches/pass', { targetUserId: userId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error during pass');
  }
};

export const getMatches = async () => {
  try {
    console.log('🔍 Calling getMatches...');
    const response = await api.get('/matches');
    console.log('📊 Matches response:', response.data);
    console.log('📊 Number of matches:', response.data.length);
    return response.data;
  } catch (error) {
    console.error('❌ getMatches error:', error);
    throw new Error(error.response?.data?.error || 'Error loading matches');
  }
};

export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error loading profile');
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error updating profile');
  }
};
