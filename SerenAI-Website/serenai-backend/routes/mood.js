// serenai-backend/routes/mood.js
const express = require('express');
const moodController = require('../controllers/moodController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All mood routes require authentication
router.use(authMiddleware);

// Mood logging
router.post('/', moodController.logMood);

// Get mood history and statistics
router.get('/history', moodController.getMoodHistory);
router.get('/statistics', moodController.getMoodStatistics);

module.exports = router;
