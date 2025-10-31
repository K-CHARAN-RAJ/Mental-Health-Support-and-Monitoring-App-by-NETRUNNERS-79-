# 🚀 SerenAI Backend - Quick Reference Card

## 📦 Files Created for You

| File | Purpose | Status |
|------|---------|--------|
| server.js | Main Express server | ✅ Ready |
| package.json | Dependencies | ✅ Ready |
| .env.example | Environment template | ✅ Ready |
| User.js | User model | ✅ Ready |
| Mood.js | Mood model | ✅ Ready |
| Journal.js | Journal model | ✅ Ready |
| MoodCircle.js | Community model | ✅ Ready |
| authController.js | Auth logic | ✅ Ready |
| moodController.js | Mood logic | ✅ Ready |
| auth.js (middleware) | JWT verification | ✅ Ready |
| aiService.js | AI/ML logic | ✅ Ready |
| socketService.js | Real-time events | ✅ Ready |
| auth.js (routes) | Auth endpoints | ✅ Ready |
| mood.js (routes) | Mood endpoints | ✅ Ready |
| logger.js | Logging system | ✅ Ready |

## ⚡ 5-Minute Setup

```bash
# 1. Create folder
mkdir serenai-backend && cd serenai-backend

# 2. Initialize & install
npm init -y
npm install express mongoose jsonwebtoken bcryptjs dotenv cors express-validator socket.io axios helmet express-mongo-sanitize natural sentiment nodemailer express-rate-limit winston
npm install --save-dev nodemon

# 3. Create .env file with:
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/serenai
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000

# 4. Copy files into structure:
# models/ → User.js, Mood.js, Journal.js, MoodCircle.js
# controllers/ → authController.js, moodController.js
# middleware/ → auth.js
# services/ → aiService.js, socketService.js
# routes/ → auth.js, mood.js
# utils/ → logger.js
# server.js in root

# 5. Start
npm run dev
```

## 🔌 Core API Endpoints

```
POST   /api/auth/register        Register user
POST   /api/auth/login           Login user
GET    /api/auth/me              Get current user
POST   /api/auth/logout          Logout

POST   /api/mood/                Log mood
GET    /api/mood/history         Get mood history
GET    /api/mood/statistics      Get mood stats
```

## 🔐 Authentication Flow

```
1. User registers: POST /api/auth/register
   Response: { token, user }

2. Store token in localStorage/sessionStorage

3. Use token in all protected requests:
   Headers: { Authorization: "Bearer TOKEN" }

4. Middleware extracts userId from token
   req.userId available in all protected routes
```

## 💾 Database Models at a Glance

### User
- email, password (hashed), firstName, lastName
- mbtiType, preferences, emergencyContacts
- stats (totalMoodLogs, etc.)

### Mood
- userId, moodScore (1-10), moodEmoji
- activities, triggers, notes
- sentiment (AI), aiInsights (AI)

### Journal
- userId, title, content
- category, tags, isPrivate
- sentiment (AI), generatedAffirmations (AI)

### MoodCircle & Message
- moodCircleId, category, members
- message text, emotion, sentiment
- likes, supportiveReplies, replies

## 🤖 AI Features Built-In

```javascript
// Sentiment Analysis
aiService.analyzeSentiment(text)
// Returns: { score, label, comparative }

// Affirmation Generation
aiService.generateAffirmation(mbtiType, moodScore)
// Returns: Personalized affirmation string

// Emotion Detection
aiService.detectEmotions(text)
// Returns: ['happy', 'calm', 'grateful']

// Action Recommendations
aiService.getActionRecommendations(moodScore, emotions)
// Returns: ['Share joy', 'Practice gratitude']
```

## 🔌 Socket.IO Events (Real-time)

### Emit from Client
```javascript
socket.emit('join-mood-circle', { moodCircleId, anonymousId })
socket.emit('send-message', { moodCircleId, message, emotion })
socket.emit('like-message', { moodCircleId, messageId })
socket.emit('typing', { moodCircleId, anonymousId })
socket.emit('stop-typing', { moodCircleId, anonymousId })
socket.emit('leave-mood-circle', { moodCircleId, anonymousId })
```

### Listen from Server
```javascript
socket.on('member-joined', (data) => {})
socket.on('new-message', (data) => {})
socket.on('message-liked', (data) => {})
socket.on('user-typing', (data) => {})
socket.on('user-stop-typing', (data) => {})
socket.on('member-left', (data) => {})
```

## 📊 Mood Statistics Returned

```json
{
  "totalLogs": 15,
  "averageMood": 7.2,
  "highestMood": 10,
  "lowestMood": 3,
  "moodTrend": "improving",
  "topTriggers": [
    {"trigger": "exercise", "count": 8},
    {"trigger": "sleep", "count": 7}
  ],
  "topActivities": [
    {"activity": "meditation", "count": 5},
    {"activity": "socializing", "count": 4}
  ]
}
```

## 🔐 Security Features

✅ Password hashing with bcryptjs
✅ JWT token authentication
✅ Rate limiting (100 req/15 min)
✅ CORS protection
✅ MongoDB injection prevention
✅ HTTP security headers (Helmet)
✅ Input validation
✅ Error handling

## 🧪 Test Endpoints with curl

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123","confirmPassword":"pass123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123"}'

# Log Mood (replace TOKEN)
curl -X POST http://localhost:5000/api/mood/ \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"moodScore":8,"moodEmoji":"😊","notes":"Feeling great!"}'

# Get Stats
curl -X GET http://localhost:5000/api/mood/statistics \
  -H "Authorization: Bearer TOKEN"
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| MongoDB connection failed | Check MONGODB_URI in .env, ensure MongoDB running |
| Invalid token error | Token expired or malformed, re-login |
| CORS error | Check CLIENT_URL in server.js matches frontend URL |
| Port already in use | Change PORT in .env or kill process: `lsof -i :5000` |
| Module not found | Run `npm install`, check spelling |

## 📈 Next Steps After MVP

1. Add journal CRUD routes
2. Implement MBTI assessment
3. Create dashboard analytics
4. Add email notifications
5. Implement image uploads
6. Add more AI models
7. Setup caching (Redis)
8. Deploy to production

## 🌐 Deployment Checklist

- [ ] Change JWT_SECRET to random string
- [ ] Use MongoDB Atlas for database
- [ ] Enable HTTPS
- [ ] Update CORS origin to production URL
- [ ] Set NODE_ENV=production
- [ ] Add comprehensive logging
- [ ] Setup monitoring (Sentry)
- [ ] Configure auto-backups
- [ ] Add CI/CD pipeline
- [ ] Update environment variables

## 📞 Quick Stats

**Lines of Code Provided:** ~1500+
**Files Created:** 15+
**Database Models:** 4
**API Endpoints:** 9+
**Socket.IO Events:** 6+
**AI Features:** 4+
**Security Features:** 7+

## 🎯 For Hackathon

**Priority 1:** Get auth + mood tracking working
**Priority 2:** Add mood statistics & trends
**Priority 3:** Implement Mood Circles (Socket.IO)
**Priority 4:** Polish & deploy

**Expected Timeline:**
- Setup: 15 minutes
- Integration with frontend: 1-2 hours
- Feature polish: 2-3 hours
- Testing & bug fixes: 1-2 hours

## 💜 You're Ready!

You have a complete backend with:
✅ Authentication system
✅ Mood tracking & logging
✅ AI sentiment analysis & affirmations
✅ Real-time Mood Circles
✅ Database models
✅ Security features
✅ Error handling
✅ Logging system
✅ Professional structure

Time to integrate with your frontend and WIN! 🚀

---

**Remember:**
- Save .env file locally (don't commit to git)
- Test endpoints before connecting frontend
- Use Postman/Insomnia for API testing
- Check logs for debugging
- Read the full setup guide [119]
- Implement remaining controllers as needed

Good luck with SerenAI! 💜🚀
