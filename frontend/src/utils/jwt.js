// Utility per estrarre informazioni dal token JWT
export const decodeJWT = (token) => {
  try {
    // JWT ha 3 parti separate da punti: header.payload.signature
    const payload = token.split('.')[1];
    // Decodifica base64
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const getUserIdFromToken = async (storage) => {
  try {
    const token = await storage.getItemAsync('userToken');
    if (!token) return null;
    
    const payload = decodeJWT(token);
    console.log('🔍 JWT payload:', payload);
    return payload?.user?._id || payload?.userId || payload?._id || null;
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
};
