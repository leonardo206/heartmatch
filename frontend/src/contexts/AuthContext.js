import React, { createContext, useState, useEffect } from 'react';
import storage from '../utils/storage';
import { loginUser, registerUser, getCurrentUser } from '../services/authService';

const AuthContext = createContext({
  signIn: () => {},
  signOut: () => {},
  signUp: () => {},
  userData: null,
  isLoading: true,
});

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const token = await storage.getItemAsync('userToken');
      const storedUserData = await storage.getItemAsync('userData');
      
      if (token && storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }
    } catch (error) {
      console.error('Error loading stored user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (token, user) => {
    try {
      console.log('Storing token:', token.substring(0, 20) + '...');
      await storage.setItemAsync('userToken', token);
      await storage.setItemAsync('userData', JSON.stringify(user));
      setUserData(user);
      console.log('Token and user data stored successfully');
    } catch (error) {
      console.error('Error storing user data:', error);
      throw error;
    }
  };

  const signUp = async (userData) => {
    try {
      const response = await registerUser(userData);
      await signIn(response.token, response.user);
      return response;
    } catch (error) {
      console.error('Error during sign up:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await storage.deleteItemAsync('userToken');
      await storage.deleteItemAsync('userData');
      setUserData(null);
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const value = {
    signIn,
    signOut,
    signUp,
    userData,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
