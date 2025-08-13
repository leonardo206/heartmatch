const express = require('express');
const Match = require('../models/Match');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create a like (swipe right)
router.post('/like', auth, async (req, res) => {
  try {
    console.log('💖 Like request received:', req.body);
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    if (!targetUserId) {
      return res.status(400).json({ error: 'Target user ID is required' });
    }

    if (currentUserId === targetUserId) {
      return res.status(400).json({ error: 'Cannot like yourself' });
    }

    // Check if target user exists
    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if there's already a match
    const existingMatch = await Match.findOne({
      users: { $all: [currentUserId, targetUserId] }
    });

    if (existingMatch) {
      return res.json({ 
        isMatch: true, 
        matchId: existingMatch._id,
        message: 'You already matched with this user!' 
      });
    }

    // Check if target user has already liked current user
    const targetUserLiked = targetUser.likes.some(likeId => likeId.toString() === currentUserId.toString());

    if (targetUserLiked) {
      // It's a match!
      const newMatch = new Match({
        users: [currentUserId, targetUserId]
      });
      await newMatch.save();

      // Add current user to target user's likes and vice versa
      targetUser.likes.push(currentUserId);
      await targetUser.save();

      // Add target user to current user's likes
      const currentUser = await User.findById(currentUserId);
      currentUser.likes.push(targetUserId);
      await currentUser.save();

      console.log(`🎉 MATCH CREATED! ${currentUser.name} matched with ${targetUser.name}`);
      console.log(`📊 Match ID: ${newMatch._id}`);

      // Emit match event via socket
      req.app.get('io').to(targetUserId.toString()).emit('newMatch', {
        matchId: newMatch._id,
        userId: currentUserId
      });

      return res.json({ 
        isMatch: true, 
        matchId: newMatch._id,
        message: 'It\'s a match!' 
      });
    }

    // Just a like, no match yet - add to current user's likes
    const currentUser = await User.findById(currentUserId);
    const alreadyLiked = currentUser.likes.some(likeId => likeId.toString() === targetUserId.toString());
    
    if (!alreadyLiked) {
      currentUser.likes.push(targetUserId);
      await currentUser.save();
      console.log(`✅ Like saved: ${currentUser.name} liked ${targetUser.name}`);
      console.log(`📊 Current user likes:`, currentUser.likes);
    } else {
      console.log(`ℹ️ User ${currentUser.name} already liked ${targetUser.name}`);
    }

    res.json({ 
      isMatch: false, 
      message: 'Like recorded!' 
    });

  } catch (error) {
    console.error('Like error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Pass on a user (swipe left)
router.post('/pass', auth, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user._id;

    if (!targetUserId) {
      return res.status(400).json({ error: 'Target user ID is required' });
    }

    // Get current user and target user
    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user already disliked this target
    const alreadyDisliked = currentUser.dislikes.some(dislikeId => 
      dislikeId.toString() === targetUserId.toString()
    );

    if (!alreadyDisliked) {
      currentUser.dislikes.push(targetUserId);
      await currentUser.save();
      console.log(`❌ Dislike saved: ${currentUser.name} passed on ${targetUser.name}`);
      console.log(`📊 Current user dislikes:`, currentUser.dislikes);
    } else {
      console.log(`ℹ️ User ${currentUser.name} already passed on ${targetUser.name}`);
    }

    res.json({ message: 'Pass recorded' });

  } catch (error) {
    console.error('Pass error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all matches for current user
router.get('/', auth, async (req, res) => {
  try {
    console.log(`🔍 Looking for matches for user: ${req.user.name} (${req.user._id})`);
    
    const matches = await Match.find({
      users: req.user._id,
      isActive: true
    }).populate('users', 'name age gender bio interests photos');

    console.log(`📊 Found ${matches.length} matches in database`);

    // Format matches to show the other user's info
    const formattedMatches = matches.map(match => {
      const otherUser = match.users.find(user => 
        user._id.toString() !== req.user._id.toString()
      );
      
      console.log(`👤 Match with: ${otherUser.name}`);
      
      return {
        matchId: match._id,
        user: otherUser,
        lastMessageAt: match.lastMessageAt,
        createdAt: match.createdAt
      };
    });

    console.log(`📤 Sending ${formattedMatches.length} formatted matches`);
    res.json(formattedMatches);
  } catch (error) {
    console.error('Get matches error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get specific match
router.get('/:matchId', auth, async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.matchId,
      users: req.user._id,
      isActive: true
    }).populate('users', 'name age gender bio interests photos');

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    const otherUser = match.users.find(user => 
      user._id.toString() !== req.user._id.toString()
    );

    res.json({
      matchId: match._id,
      user: otherUser,
      lastMessageAt: match.lastMessageAt,
      createdAt: match.createdAt
    });
  } catch (error) {
    console.error('Get match error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Unmatch with someone
router.delete('/:matchId', auth, async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.matchId,
      users: req.user._id,
      isActive: true
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    match.isActive = false;
    await match.save();

    // Notify the other user about unmatch
    const otherUserId = match.users.find(id => 
      id.toString() !== req.user._id.toString()
    );
    
    req.app.get('io').to(otherUserId.toString()).emit('unmatch', {
      matchId: match._id
    });

    res.json({ message: 'Unmatched successfully' });
  } catch (error) {
    console.error('Unmatch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 