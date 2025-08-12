import api from './api';

export const getMessages = async (matchId, page = 1, limit = 50) => {
  try {
    const response = await api.get(`/messages/${matchId}`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error loading messages');
  }
};

export const sendMessage = async (matchId, content, messageType = 'text') => {
  try {
    const response = await api.post('/messages', {
      matchId,
      content,
      messageType
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error sending message');
  }
};

export const markMessagesAsRead = async (matchId) => {
  try {
    const response = await api.put(`/messages/${matchId}/read`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error marking messages as read');
  }
}; 