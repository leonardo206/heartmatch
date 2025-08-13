const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { email, password, name, age, gender, interestedIn, bio, interests, location, photos } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      email,
      password,
      name,
      age,
      gender,
      interestedIn,
      bio,
      interests,
      location,
      photos: photos || []
    });

    await user.save();

    // Create JWT token
    const payload = {
      user: {
        _id: user._id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'heartmatch-super-secret-jwt-key-2024-production-ready',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            age: user.age,
            gender: user.gender,
            interestedIn: user.interestedIn,
            bio: user.bio,
            interests: user.interests,
            location: user.location,
            photos: user.photos
          }
        });
      }
    );
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      user: {
        _id: user._id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'heartmatch-super-secret-jwt-key-2024-production-ready',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
            age: user.age,
            gender: user.gender,
            interestedIn: user.interestedIn,
            bio: user.bio,
            interests: user.interests,
            location: user.location,
            photos: user.photos
          }
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'heartmatch-super-secret-jwt-key-2024-production-ready');
    const user = await User.findById(decoded.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
});

module.exports = router;
