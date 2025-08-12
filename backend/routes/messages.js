const express = require('express');
const Message = require('../models/Message');
const Match = require('../models/Match');
const auth = require('../middleware/auth');
const Joi = require('joi');

const router = express.Router();

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    console.log('💬 Send message request:', req.body);
    console.log('👤 Sender:', req.user.name, req.user._id);
    
    const messageSchema = Joi.object({
      matchId: Joi.string().required(),
      content: Joi.string().max(1000).required(),
      messageType: Joi.string().valid('text', 'image', 'gif').default('text')
    });

    const { error } = messageSchema.validate(req.body);
    if (error) {
      console.log('❌ Validation error:', error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { matchId, content, messageType = 'text' } = req.body;
    const senderId = req.user._id;

    // Verify match exists and user is part of it
    console.log('🔍 Looking for match:', matchId);
    const match = await Match.findOne({
      _id: matchId,
      users: senderId,
      isActive: true
    });

    if (!match) {
      console.log('❌ Match not found');
      return res.status(404).json({ error: 'Match not found' });
    }
    
    console.log('✅ Match found:', match._id);

    // Get the other user in the match (recipient)
    const recipientId = match.users.find(userId => 
      userId.toString() !== senderId.toString()
    );
    
    console.log('📝 Creating message...');
    const message = new Message({
      match: matchId,
      sender: senderId,
      recipient: recipientId,
      content,
      messageType
    });

    await message.save();
    console.log('✅ Message saved:', message._id);

    // Update match's lastMessageAt
    match.lastMessageAt = new Date();
    await match.save();

    // Populate sender info for response
    await message.populate('sender', 'name photos');

    // Emit message to other user via socket
    const otherUserId = match.users.find(id => 
      id.toString() !== senderId
    );

    req.app.get('io').to(otherUserId.toString()).emit('newMessage', {
      matchId,
      message: {
        _id: message._id,
        content: message.content,
        messageType: message.messageType,
        sender: message.sender,
        createdAt: message.createdAt
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages for a match
router.get('/:matchId', auth, async (req, res) => {
  try {
    const { matchId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user._id;

    // Verify match exists and user is part of it
    const match = await Match.findOne({
      _id: matchId,
      users: userId,
      isActive: true
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Get messages with pagination
    const messages = await Message.find({ match: matchId })
      .populate('sender', 'name photos')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Mark messages as read if they're from the other user
    const unreadMessages = messages.filter(msg => 
      msg.sender._id.toString() !== userId && !msg.isRead
    );

    if (unreadMessages.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessages.map(msg => msg._id) } },
        { isRead: true, readAt: new Date() }
      );
    }

    res.json(messages.reverse()); // Return in chronological order
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark messages as read
router.put('/:matchId/read', auth, async (req, res) => {
  try {
    const { matchId } = req.params;
    const userId = req.user._id;

    // Verify match exists and user is part of it
    const match = await Match.findOne({
      _id: matchId,
      users: userId,
      isActive: true
    });

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    // Mark all unread messages from other user as read
    await Message.updateMany(
      {
        match: matchId,
        sender: { $ne: userId },
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark messages read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 