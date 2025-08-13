import api from './api';
import { currentConfig } from '../config/config';

export const uploadProfileImage = async (imageUri) => {
  try {
    // Crea un FormData per l'upload
    const formData = new FormData();
    
    // Aggiungi l'immagine al FormData
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg', // o 'image/png' a seconda del tipo
      name: 'profile-image.jpg'
    });

    // Fai la richiesta di upload
    const response = await api.post('/upload/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error(error.response?.data?.error || 'Error uploading image');
  }
};
