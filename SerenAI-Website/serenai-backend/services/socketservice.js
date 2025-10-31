// serenai-backend/services/socketService.js
const logger = require('../utils/logger');
const { MoodCircle, Message } = require('../models/MoodCircle');

// ════════════════════════════════════
// SOCKET.IO EVENT HANDLERS
// ════════════════════════════════════

exports.initialize = (io) => {
  io.on('connection', (socket) => {
    logger.info(`✅ Client connected: ${socket.id}`);
    
    // ═══════════════════════════════════
    // JOIN MOOD CIRCLE
    // ═══════════════════════════════════
    socket.on('join-mood-circle', async (data) => {
      try {
        const { moodCircleId, anonymousId } = data;
        const roomName = `mood-circle-${moodCircleId}`;
        
        socket.join(roomName);
        logger.info(`User joined mood circle: ${moodCircleId}`);
        
        // Emit room members updated
        io.to(roomName).emit('member-joined', {
          anonymousId,
          timestamp: new Date()
        });
        
      } catch (error) {
        logger.error('Join mood circle error:', error);
        socket.emit('error', { message: 'Failed to join mood circle' });
      }
    });
    
    // ═══════════════════════════════════
    // SEND MESSAGE
    // ═══════════════════════════════════
    socket.on('send-message', async (data) => {
      try {
        const { moodCircleId, anonymousId, message, emotion } = data;
        const roomName = `mood-circle-${moodCircleId}`;
        
        // Create message in database
        const newMessage = await Message.create({
          moodCircleId,
          anonymousId,
          message,
          emotion
        });
        
        // Broadcast message to room
        io.to(roomName).emit('new-message', {
          messageId: newMessage._id,
          anonymousId,
          message,
          emotion,
          timestamp: newMessage.createdAt
        });
        
        logger.info(`Message sent in mood circle: ${moodCircleId}`);
        
      } catch (error) {
        logger.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });
    
    // ═══════════════════════════════════
    // LIKE MESSAGE
    // ═══════════════════════════════════
    socket.on('like-message', async (data) => {
      try {
        const { moodCircleId, messageId } = data;
        const roomName = `mood-circle-${moodCircleId}`;
        
        // Update likes in database
        await Message.findByIdAndUpdate(messageId, {
          $inc: { likes: 1 }
        });
        
        // Broadcast like to room
        io.to(roomName).emit('message-liked', {
          messageId,
          timestamp: new Date()
        });
        
      } catch (error) {
        logger.error('Like message error:', error);
        socket.emit('error', { message: 'Failed to like message' });
      }
    });
    
    // ═══════════════════════════════════
    // TYPING INDICATOR
    // ═══════════════════════════════════
    socket.on('typing', (data) => {
      const { moodCircleId, anonymousId } = data;
      const roomName = `mood-circle-${moodCircleId}`;
      
      socket.to(roomName).emit('user-typing', {
        anonymousId
      });
    });
    
    socket.on('stop-typing', (data) => {
      const { moodCircleId, anonymousId } = data;
      const roomName = `mood-circle-${moodCircleId}`;
      
      socket.to(roomName).emit('user-stop-typing', {
        anonymousId
      });
    });
    
    // ═══════════════════════════════════
    // LEAVE MOOD CIRCLE
    // ═══════════════════════════════════
    socket.on('leave-mood-circle', (data) => {
      try {
        const { moodCircleId, anonymousId } = data;
        const roomName = `mood-circle-${moodCircleId}`;
        
        socket.leave(roomName);
        
        io.to(roomName).emit('member-left', {
          anonymousId,
          timestamp: new Date()
        });
        
        logger.info(`User left mood circle: ${moodCircleId}`);
        
      } catch (error) {
        logger.error('Leave mood circle error:', error);
      }
    });
    
    // ═══════════════════════════════════
    // DISCONNECT
    // ═══════════════════════════════════
    socket.on('disconnect', () => {
      logger.info(`❌ Client disconnected: ${socket.id}`);
    });
    
    // ═══════════════════════════════════
    // ERROR HANDLING
    // ═══════════════════════════════════
    socket.on('error', (error) => {
      logger.error('Socket error:', error);
    });
  });
};
