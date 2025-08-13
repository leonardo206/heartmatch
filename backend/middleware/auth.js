const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth middleware - Token received:', token ? token.substring(0, 20) + '...' : 'null');
    
    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const secret = process.env.JWT_SECRET || 'heartmatch-super-secret-jwt-key-2024-production-ready';
    console.log('JWT Secret used for verification:', secret);
    const decoded = jwt.verify(token, secret);
    console.log('Auth middleware - Decoded token:', decoded);
    
    console.log('Auth middleware - Looking for user with ID:', decoded.user._id);
    const user = await User.findById(decoded.user._id).select('-password');
    console.log('Auth middleware - User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('Auth middleware - User not found');
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = user;
    console.log('Auth middleware - User set in request');
    next();
  } catch (error) {
    console.error('Auth middleware - Error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = auth; 