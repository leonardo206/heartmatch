import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Fallback per web usando localStorage
const webStorage = {
  async getItemAsync(key) {
    try {
      const value = localStorage.getItem(key);
      console.log(`Getting ${key} from localStorage:`, value ? value.substring(0, 20) + '...' : 'null');
      return value;
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  },
  
  async setItemAsync(key, value) {
    try {
      console.log(`Setting ${key} in localStorage:`, value.substring(0, 20) + '...');
      localStorage.setItem(key, value);
      console.log(`Successfully set ${key} in localStorage`);
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
    }
  },
  
  async deleteItemAsync(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error deleting item from localStorage:', error);
    }
  }
};

// Usa SecureStore su mobile, localStorage su web
const storage = Platform.OS === 'web' ? webStorage : SecureStore;

export default storage;
