const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const secret = process.env.JWT_SECRET || 'heartmatch-super-secret-jwt-key-2024-production-ready';
    const decoded = jwt.verify(token, secret);
    
    const user = await User.findById(decoded.user._id).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware - Error:', error);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

module.exports = auth; 