// serenai-backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const http = require('http');
const socketIO = require('socket.io');
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
  }
});

// ════════════════════════════════════
// MIDDLEWARE SETUP
// ════════════════════════════════════

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// ════════════════════════════════════
// DATABASE CONNECTION
// ════════════════════════════════════

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/serenai', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  logger.info('✅ MongoDB connected successfully');
})
.catch((err) => {
  logger.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// ════════════════════════════════════
// IMPORT ROUTES
// ════════════════════════════════════

const authRoutes = require('./routes/auth');
const moodRoutes = require('./routes/mood');
const journalRoutes = require('./routes/journal');
const moodCircleRoutes = require('./routes/moodCircle');
const aiRoutes = require('./routes/ai');
const mbtiRoutes = require('./routes/mbti');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/user');

// ════════════════════════════════════
// REGISTER ROUTES
// ════════════════════════════════════

app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/mood-circles', moodCircleRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/mbti', mbtiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user', userRoutes);

// ════════════════════════════════════
// HEALTH CHECK ENDPOINT
// ════════════════════════════════════

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'SerenAI API is running',
    timestamp: new Date().toISOString()
  });
});

// ════════════════════════════════════
// SOCKET.IO SETUP (MOOD CIRCLES)
// ════════════════════════════════════

const socketEvents = require('./services/socketService');
socketEvents.initialize(io);

// ════════════════════════════════════
// ERROR HANDLING MIDDLEWARE
// ════════════════════════════════════

app.use((err, req, res, next) => {
  logger.error('Error:', err);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    status: 'error',
    statusCode: status,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: 'Route not found'
  });
});

// ════════════════════════════════════
// START SERVER
// ════════════════════════════════════

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`
    ╔════════════════════════════════════╗
    ║   🌟 SerenAI Backend Server 🌟    ║
    ║   Running on http://localhost:${PORT}   ║
    ║   Environment: ${process.env.NODE_ENV || 'development'}        ║
    ╚════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = { app, server, io };
