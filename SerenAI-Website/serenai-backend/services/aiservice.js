// serenai-backend/services/aiService.js
const axios = require('axios');
const Sentiment = require('sentiment');
const logger = require('../utils/logger');

// Initialize sentiment analyzer
const sentimentAnalyzer = new Sentiment();

// ════════════════════════════════════
// SENTIMENT ANALYSIS
// ════════════════════════════════════
exports.analyzeSentiment = async (text) => {
  try {
    if (!text) return null;
    
    const result = sentimentAnalyzer.analyze(text);
    
    return {
      score: result.score / 5, // Normalize to -1 to 1
      label: result.score > 0.5 ? 'positive' : result.score < -0.5 ? 'negative' : 'neutral',
      comparative: result.comparative
    };
  } catch (error) {
    logger.error('Sentiment analysis error:', error);
    return null;
  }
};

// ════════════════════════════════════
// GENERATE AI INSIGHTS
// ════════════════════════════════════
exports.generateInsights = async (moodScore, journalText) => {
  try {
    const insights = {
      pattern: getPattern(moodScore),
      suggestion: getSuggestion(moodScore),
      affirmation: getAffirmation(moodScore, journalText)
    };
    
    return insights;
  } catch (error) {
    logger.error('Generate insights error:', error);
    return null;
  }
};

// ════════════════════════════════════
// EMOTION DETECTION
// ════════════════════════════════════
exports.detectEmotions = (text) => {
  const emotions = {
    happy: ['happy', 'joyful', 'excited', 'great', 'wonderful'],
    sad: ['sad', 'down', 'blue', 'depressed', 'miserable'],
    anxious: ['anxious', 'worried', 'nervous', 'stressed', 'tense'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil'],
    angry: ['angry', 'furious', 'mad', 'upset', 'irritated'],
    grateful: ['grateful', 'thankful', 'appreciated', 'blessed']
  };
  
  const textLower = text.toLowerCase();
  const detectedEmotions = [];
  
  Object.entries(emotions).forEach(([emotion, keywords]) => {
    keywords.forEach(keyword => {
      if (textLower.includes(keyword)) {
        detectedEmotions.push(emotion);
      }
    });
  });
  
  return [...new Set(detectedEmotions)];
};

// ════════════════════════════════════
// GENERATE AFFIRMATION
// ════════════════════════════════════
exports.generateAffirmation = (mbtiType = null, moodScore = 5) => {
  const affirmations = {
    positive: [
      'You are stronger than you think.',
      'Your feelings are valid and important.',
      'Every day is a fresh start.',
      'You deserve to be happy and healthy.',
      'Progress, not perfection, is the goal.',
      'You are worthy of love and compassion.'
    ],
    neutral: [
      'It\'s okay to have mixed feelings.',
      'Take things one step at a time.',
      'Your feelings will pass.',
      'You are doing your best.',
      'Self-care is not selfish.',
      'You are growing every day.'
    ],
    negative: [
      'This feeling will not last forever.',
      'You have overcome difficult times before.',
      'Reaching out for help is a sign of strength.',
      'You matter, and your well-being is important.',
      'Small steps lead to big changes.',
      'Be gentle with yourself.'
    ]
  };
  
  let category = 'neutral';
  if (moodScore >= 7) category = 'positive';
  else if (moodScore <= 3) category = 'negative';
  
  const categoryAffirmations = affirmations[category];
  return categoryAffirmations[Math.floor(Math.random() * categoryAffirmations.length)];
};

// ════════════════════════════════════
// Helper Functions
// ════════════════════════════════════

function getPattern(moodScore) {
  if (moodScore >= 8) return 'You seem to be having an excellent day!';
  if (moodScore >= 6) return 'Your mood is positive and stable.';
  if (moodScore >= 5) return 'You are managing well with some ups and downs.';
  if (moodScore >= 3) return 'You might be feeling some challenges today.';
  return 'You seem to be going through a tough time.';
}

function getSuggestion(moodScore) {
  if (moodScore >= 8) return 'Keep enjoying this positive energy! Consider sharing your joy with others.';
  if (moodScore >= 6) return 'Continue what you\'re doing! Maybe try a new activity you enjoy.';
  if (moodScore >= 5) return 'Take time for self-care. A short walk or meditation might help.';
  if (moodScore >= 3) return 'Be kind to yourself. Consider reaching out to someone you trust.';
  return 'Please consider contacting a mental health professional or crisis line.';
}

function getAffirmation(moodScore, journalText) {
  if (moodScore >= 8) return 'Your positive mindset is inspiring!';
  if (moodScore >= 6) return 'You are handling things well.';
  if (moodScore >= 5) return 'You are resilient and capable.';
  if (moodScore >= 3) return 'It\'s okay to struggle sometimes.';
  return 'Your feelings are valid, and you deserve support.';
}

// ════════════════════════════════════
// EMOTION-TO-ACTION RECOMMENDATIONS
// ════════════════════════════════════
exports.getActionRecommendations = (moodScore, emotions) => {
  const recommendations = {
    happy: ['Share your joy with friends', 'Start a new project', 'Help someone in need'],
    sad: ['Express your feelings', 'Reach out for support', 'Do something gentle'],
    anxious: ['Practice deep breathing', 'Go for a walk', 'Talk to someone'],
    calm: ['Maintain this peace', 'Practice gratitude', 'Meditate'],
    angry: ['Take a break', 'Physical exercise', 'Write your feelings'],
    grateful: ['Share appreciation', 'Journaling', 'Acts of kindness']
  };
  
  const actions = [];
  emotions.forEach(emotion => {
    if (recommendations[emotion]) {
      actions.push(...recommendations[emotion]);
    }
  });
  
  return [...new Set(actions)].slice(0, 3);
};
