// serenai-backend/models/MoodCircle.js
const mongoose = require('mongoose');

const moodCircleSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 100
  },
  description: String,
  category: {
    type: String,
    enum: ['anxiety', 'depression', 'stress', 'joy', 'gratitude', 'sleep', 'relationships', 'work', 'general'],
    required: true
  },
  
  // Community Info
  members: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    anonymousId: String, // Anonymous identifier
    joinedAt: { type: Date, default: Date.now }
  }],
  moderators: [mongoose.Schema.Types.ObjectId],
  
  // Settings
  isPrivate: { type: Boolean, default: false },
  isAnonymous: { type: Boolean, default: true },
  maxMembers: { type: Number, default: 1000 },
  
  // Stats
  totalMembers: { type: Number, default: 0 },
  totalMessages: { type: Number, default: 0 },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// ════════════════════════════════════
// MESSAGE SCHEMA
// ════════════════════════════════════

const messageSchema = new mongoose.Schema({
  moodCircleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MoodCircle',
    required: true
  },
  userId: mongoose.Schema.Types.ObjectId,
  anonymousId: String, // For anonymous circles
  
  // Message Content
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  emotion: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'calm', 'angry', 'grateful', 'overwhelmed', 'motivated']
  },
  
  // Sentiment
  sentiment: {
    score: Number,
    label: String
  },
  
  // Reactions
  likes: { type: Number, default: 0 },
  supportiveReplies: { type: Number, default: 0 },
  
  // Replies (nested)
  replies: [{
    userId: mongoose.Schema.Types.ObjectId,
    anonymousId: String,
    message: String,
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Indexes
moodCircleSchema.index({ category: 1 });
moodCircleSchema.index({ createdAt: -1 });
messageSchema.index({ moodCircleId: 1, createdAt: -1 });

module.exports = {
  MoodCircle: mongoose.model('MoodCircle', moodCircleSchema),
  Message: mongoose.model('Message', messageSchema)
};
