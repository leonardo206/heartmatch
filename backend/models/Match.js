const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  matchedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: new Map()
  }
}, {
  timestamps: true
});

// Index per query efficienti
matchSchema.index({ users: 1 });
matchSchema.index({ matchedAt: -1 });
matchSchema.index({ lastMessageAt: -1 });

// Metodo per ottenere l'altro utente nel match
matchSchema.methods.getOtherUser = function(userId) {
  return this.users.find(user => user.toString() !== userId.toString());
};

// Metodo per aggiornare il contatore messaggi non letti
matchSchema.methods.incrementUnreadCount = function(userId) {
  const currentCount = this.unreadCount.get(userId.toString()) || 0;
  this.unreadCount.set(userId.toString(), currentCount + 1);
  return this.save();
};

// Metodo per resettare il contatore messaggi non letti
matchSchema.methods.resetUnreadCount = function(userId) {
  this.unreadCount.set(userId.toString(), 0);
  return this.save();
};

module.exports = mongoose.model('Match', matchSchema); 