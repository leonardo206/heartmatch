const express = require('express');
const User = require('../models/User');
const Match = require('../models/Match');
const auth = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Get potential matches (users to swipe on)
router.get('/potential-matches', auth, async (req, res) => {
  try {
    console.log('Potential matches request received');
    console.log('User making request:', req.user);
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { latitude, longitude, maxDistance = 50 } = req.query;
    
    // Build query for potential matches
    const query = {
      _id: { $ne: currentUser._id }
    };

    // Add gender preference filter
    if (currentUser.interestedIn && currentUser.interestedIn.length > 0) {
      query.gender = { $in: currentUser.interestedIn };
    }

    // Add interested in filter
    if (currentUser.gender) {
      query.interestedIn = { $in: [currentUser.gender] };
    }

    // Add age filter
    const minAge = currentUser.preferences?.ageRange?.min || 18;
    const maxAge = currentUser.preferences?.ageRange?.max || 100;
    
    query.age = {
      $gte: minAge,
      $lte: maxAge
    };

    // Add geospatial filter if coordinates provided
    if (latitude && longitude) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: maxDistance * 1000 // Convert km to meters
        }
      };
    }

    // Get user's existing matches to exclude them
    const existingMatches = await Match.find({
      users: currentUser._id,
      isActive: true
    });

    // Extract the IDs of users the current user has already matched with
    const matchedUserIds = existingMatches.map(match => {
      const otherUserId = match.users.find(userId => 
        userId.toString() !== currentUser._id.toString()
      );
      return otherUserId;
    });

    // Get users the current user has already liked or disliked
    const likedUserIds = currentUser.likes || [];
    const dislikedUserIds = currentUser.dislikes || [];

    // Combine all users to exclude (matches, likes, dislikes)
    const excludedUserIds = [
      ...matchedUserIds,
      ...likedUserIds,
      ...dislikedUserIds
    ];

    // Exclude all these users from potential matches
    if (excludedUserIds.length > 0) {
      query._id = { 
        $ne: currentUser._id,
        $nin: excludedUserIds
      };
    }

    console.log('Potential matches query:', query);
    console.log('Excluding matched users:', matchedUserIds);

    const potentialMatches = await User.find(query)
      .select('_id name age gender bio interests photos location lastActive')
      .limit(20);

    console.log('Found potential matches:', potentialMatches.length);

    res.json(potentialMatches);
  } catch (error) {
    console.error('Get potential matches error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updateSchema = Joi.object({
      firstName: Joi.string(),
      lastName: Joi.string(),
      bio: Joi.string().max(500),
      interests: Joi.array().items(Joi.string()),
      photos: Joi.array().items(Joi.object({
        url: Joi.string().uri(),
        isPrimary: Joi.boolean()
      })),
      location: Joi.object({
        coordinates: Joi.array().items(Joi.number()).length(2)
      })
    });

    const { error } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update profile fields
    Object.keys(req.body).forEach(key => {
      if (key === 'location') {
        user.profile.location.coordinates = req.body.location.coordinates;
      } else {
        user.profile[key] = req.body[key];
      }
    });

    await user.save();

    res.json({ message: 'Profile updated successfully', profile: user.profile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user by ID
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('profile.firstName profile.lastName profile.bio profile.photos profile.interests');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 