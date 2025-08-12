import api from './api';

export const getMatch = async (matchId) => {
  try {
    const response = await api.get(`/matches/${matchId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Errore nel caricamento del match');
  }
};

export const unmatchUser = async (matchId) => {
  try {
    const response = await api.delete(`/matches/${matchId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Errore durante l\'unmatch');
  }
};
