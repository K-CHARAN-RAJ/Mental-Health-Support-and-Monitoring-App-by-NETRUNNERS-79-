// serenai-backend/models/Mood.js
const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Mood Data
  moodScore: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  moodEmoji: {
    type: String,
    enum: ['😢', '😞', '😐', '🙂', '😊', '😄'],
    required: true
  },
  
  // Context
  activities: [String], // e.g., ['work', 'exercise', 'socializing']
  triggers: [String], // What caused this mood?
  location: String,
  timeOfDay: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'night']
  },
  
  // Energy Level & Physical State
  energyLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  sleepQuality: {
    type: Number,
    min: 1,
    max: 10
  },
  physicalActivity: String,
  
  // Sentiment Analysis (AI-generated)
  sentiment: {
    score: Number, // -1 to 1
    label: { type: String, enum: ['negative', 'neutral', 'positive'] }
  },
  
  // Colors & Visual Representation
  colorRepresentation: String, // hex color
  journalEntryRef: mongoose.Schema.Types.ObjectId, // Reference to journal entry if exists
  
  // Notes
  notes: String,
  
  // AI Insights
  aiInsights: {
    pattern: String,
    suggestion: String,
    affirmation: String
  },
  
  // Timestamps
  loggedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Index for faster queries
moodSchema.index({ userId: 1, createdAt: -1 });
moodSchema.index({ userId: 1, moodScore: 1 });

module.exports = mongoose.model('Mood', moodSchema);
