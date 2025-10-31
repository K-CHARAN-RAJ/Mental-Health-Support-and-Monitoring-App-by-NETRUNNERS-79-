// serenai-backend/controllers/moodController.js
const Mood = require('../models/Mood');
const User = require('../models/User');
const aiService = require('../services/aiService');
const logger = require('../utils/logger');

// ════════════════════════════════════
// LOG MOOD
// ════════════════════════════════════
exports.logMood = async (req, res) => {
  try {
    const { moodScore, moodEmoji, activities, triggers, notes, energyLevel, sleepQuality } = req.body;
    const userId = req.userId;
    
    // Validate mood score
    if (!moodScore || moodScore < 1 || moodScore > 10) {
      return res.status(400).json({
        status: 'error',
        message: 'Mood score must be between 1 and 10'
      });
    }
    
    // Create mood log
    const mood = await Mood.create({
      userId,
      moodScore,
      moodEmoji,
      activities,
      triggers,
      notes,
      energyLevel,
      sleepQuality,
      loggedAt: new Date()
    });
    
    // Get AI sentiment analysis
    if (notes) {
      const sentiment = await aiService.analyzeSentiment(notes);
      mood.sentiment = sentiment;
      
      // Generate AI insights
      const insights = await aiService.generateInsights(moodScore, notes);
      mood.aiInsights = insights;
    }
    
    await mood.save();
    
    // Update user statistics
    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.totalMoodLogs': 1 }
    });
    
    logger.info(`Mood logged for user: ${userId}, score: ${moodScore}`);
    
    res.status(201).json({
      status: 'success',
      message: 'Mood logged successfully',
      mood
    });
    
  } catch (error) {
    logger.error('Log mood error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// ════════════════════════════════════
// GET MOOD HISTORY
// ════════════════════════════════════
exports.getMoodHistory = async (req, res) => {
  try {
    const userId = req.userId;
    const { days = 30, limit = 50 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const moods = await Mood.find({
      userId,
      createdAt: { $gte: startDate }
    })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));
    
    res.status(200).json({
      status: 'success',
      count: moods.length,
      moods
    });
    
  } catch (error) {
    logger.error('Get mood history error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// ════════════════════════════════════
// GET MOOD STATISTICS
// ════════════════════════════════════
exports.getMoodStatistics = async (req, res) => {
  try {
    const userId = req.userId;
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const moods = await Mood.find({
      userId,
      createdAt: { $gte: startDate }
    });
    
    // Calculate statistics
    const stats = {
      totalLogs: moods.length,
      averageMood: moods.length ? (moods.reduce((sum, m) => sum + m.moodScore, 0) / moods.length).toFixed(2) : 0,
      highestMood: moods.length ? Math.max(...moods.map(m => m.moodScore)) : 0,
      lowestMood: moods.length ? Math.min(...moods.map(m => m.moodScore)) : 0,
      moodTrend: calculateTrend(moods),
      topTriggers: getTopTriggers(moods),
      topActivities: getTopActivities(moods)
    };
    
    res.status(200).json({
      status: 'success',
      stats
    });
    
  } catch (error) {
    logger.error('Get mood statistics error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

// ════════════════════════════════════
// Helper Functions
// ════════════════════════════════════

function calculateTrend(moods) {
  if (moods.length < 2) return 'stable';
  
  const firstHalf = moods.slice(0, Math.ceil(moods.length / 2));
  const secondHalf = moods.slice(Math.ceil(moods.length / 2));
  
  const avgFirst = firstHalf.reduce((sum, m) => sum + m.moodScore, 0) / firstHalf.length;
  const avgSecond = secondHalf.reduce((sum, m) => sum + m.moodScore, 0) / secondHalf.length;
  
  if (avgSecond > avgFirst) return 'improving';
  if (avgSecond < avgFirst) return 'declining';
  return 'stable';
}

function getTopTriggers(moods) {
  const triggers = {};
  moods.forEach(mood => {
    if (mood.triggers) {
      mood.triggers.forEach(trigger => {
        triggers[trigger] = (triggers[trigger] || 0) + 1;
      });
    }
  });
  return Object.entries(triggers)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([trigger, count]) => ({ trigger, count }));
}

function getTopActivities(moods) {
  const activities = {};
  moods.forEach(mood => {
    if (mood.activities) {
      mood.activities.forEach(activity => {
        activities[activity] = (activities[activity] || 0) + 1;
      });
    }
  });
  return Object.entries(activities)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([activity, count]) => ({ activity, count }));
}
