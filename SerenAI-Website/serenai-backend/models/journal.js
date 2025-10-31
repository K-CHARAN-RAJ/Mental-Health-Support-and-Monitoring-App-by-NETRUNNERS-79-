// serenai-backend/models/Journal.js
const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Journal Entry
  title: {
    type: String,
    required: [true, 'Title is required'],
    maxlength: 200
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: 10
  },
  
  // Mood Context
  moodAtTime: {
    type: Number,
    min: 1,
    max: 10
  },
  moodRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mood'
  },
  
  // AI Analysis
  sentiment: {
    score: Number, // -1 to 1
    label: String // negative, neutral, positive
  },
  keywords: [String],
  emotions: [String],
  
  // AI-Generated Affirmations from this entry
  generatedAffirmations: [{
    text: String,
    strength: { type: Number, min: 1, max: 5 }
  }],
  
  // Tags & Categories
  tags: [String],
  category: {
    type: String,
    enum: ['anxiety', 'depression', 'stress', 'joy', 'gratitude', 'achievement', 'reflection', 'other']
  },
  
  // Privacy
  isPrivate: { type: Boolean, default: true },
  isAnonymous: { type: Boolean, default: false },
  
  // Rich Content
  images: [String],
  audioNotes: [String],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastEditedAt: Date
}, { timestamps: true });

// Index for efficient queries
journalSchema.index({ userId: 1, createdAt: -1 });
journalSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Journal', journalSchema);
