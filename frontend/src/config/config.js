// Configuration for different environments
const config = {
  development: {
    apiUrl: 'http://localhost:3001/api',
    socketUrl: 'http://localhost:3001',
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL || 'https://heartmatch-a79y.onrender.com/api',
    socketUrl: process.env.REACT_APP_SOCKET_URL || 'https://heartmatch-a79y.onrender.com',
  },
};

// Determine current environment
const getCurrentConfig = () => {
  if (__DEV__) {
    return config.development;
  }
  return config.production;
};

export const currentConfig = getCurrentConfig();
export default config;
