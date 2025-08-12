module.exports = (io) => {
  // Store socket.io instance in app for use in routes
  if (io.app) {
    io.app.set('io', io);
  }

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join user's personal room for notifications
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
      const { matchId, userId } = data;
      socket.to(matchId).emit('userTyping', { userId, matchId });
    });

    socket.on('stopTyping', (data) => {
      const { matchId, userId } = data;
      socket.to(matchId).emit('userStopTyping', { userId, matchId });
    });

    // Handle online status
    socket.on('online', (userId) => {
      socket.broadcast.emit('userOnline', { userId });
    });

    socket.on('offline', (userId) => {
      socket.broadcast.emit('userOffline', { userId });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}; 