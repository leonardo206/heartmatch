const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'location'],
    default: 'text'
  },
  mediaUrl: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index per query efficienti
messageSchema.index({ match: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ recipient: 1, isRead: 1 });

// Metodo per segnare messaggio come letto
messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Metodo per ottenere messaggi di un match
messageSchema.statics.getMatchMessages = function(matchId, limit = 50, skip = 0) {
  return this.find({ match: matchId, isDeleted: false })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sender', 'name photos')
    .populate('recipient', 'name photos');
};

// Metodo per ottenere messaggi non letti di un utente
messageSchema.statics.getUnreadMessages = function(userId) {
  return this.find({ 
    recipient: userId, 
    isRead: false, 
    isDeleted: false 
  })
  .populate('sender', 'name photos')
  .populate('match', 'users');
};

module.exports = mongoose.model('Message', messageSchema); 