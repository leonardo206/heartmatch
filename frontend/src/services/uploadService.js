import api from './api';
import { currentConfig } from '../config/config';

// Funzione per costruire l'URL completo dell'immagine
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Se è già un URL completo, restituiscilo
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Altrimenti, costruisci l'URL usando la configurazione corrente
  const baseUrl = currentConfig.apiUrl.replace('/api', '');
  return `${baseUrl}${imagePath}`;
};

export const uploadProfileImage = async (imageUri) => {
  try {
    console.log('🔍 Upload - Image URI:', imageUri);
    console.log('🔍 Upload - Environment:', typeof window !== 'undefined' ? 'Web' : 'Mobile');
    
    // Crea un FormData per l'upload
    const formData = new FormData();
    
    // Determina il tipo di file dall'URI
    const fileType = imageUri.includes('.png') ? 'image/png' : 'image/jpeg';
    const fileName = imageUri.includes('.png') ? 'profile-image.png' : 'profile-image.jpg';
    
    console.log('🔍 Upload - File type:', fileType);
    console.log('🔍 Upload - File name:', fileName);
    
    // Per React Native Web, dobbiamo convertire l'URI in un Blob
    if (typeof window !== 'undefined' && imageUri.startsWith('blob:')) {
      // Se è già un blob, usalo direttamente
      console.log('🔍 Upload - Using blob directly');
      formData.append('image', imageUri, fileName);
    } else {
      // Per URI locali, dobbiamo fare fetch e convertire in blob
      console.log('🔍 Upload - Converting URI to blob');
      const response = await fetch(imageUri);
      const blob = await response.blob();
      console.log('🔍 Upload - Blob size:', blob.size);
      formData.append('image', blob, fileName);
    }

    console.log('🔍 Upload - FormData created, sending request...');

    // Fai la richiesta di upload
    const response = await api.post('/upload/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('🔍 Upload - Response received:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Upload error:', error);
    console.error('❌ Upload error response:', error.response?.data);
    throw new Error(error.response?.data?.error || 'Error uploading image');
  }
};
