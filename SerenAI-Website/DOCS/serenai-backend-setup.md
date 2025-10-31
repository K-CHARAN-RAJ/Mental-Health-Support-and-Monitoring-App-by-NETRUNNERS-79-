# SerenAI Backend - Complete Setup Guide

## 📋 Table of Contents
1. Installation & Setup
2. Environment Configuration
3. Database Setup
4. API Endpoints
5. Socket.IO Events
6. Running the Server

---

## 🚀 Installation & Setup

### Step 1: Clone/Create Project
```bash
mkdir serenai-backend
cd serenai-backend
npm init -y
```

### Step 2: Install Dependencies
```bash
npm install express mongoose jsonwebtoken bcryptjs dotenv cors express-validator socket.io axios crypto express-rate-limit winston helmet express-mongo-sanitize natural sentiment nodemailer
npm install --save-dev nodemon jest supertest
```

### Step 3: Create Project Structure
```
serenai-backend/
├── server.js
├── package.json
├── .env
├── .gitignore
├── config/
├── models/
├── controllers/
├── routes/
├── middleware/
├── services/
├── utils/
└── logs/
```

---

## 🔧 Environment Configuration

Create `.env` file in root:

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/serenai
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

For production (MongoDB Atlas):
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/serenai
```

---

## 🗄️ Database Setup

### Install MongoDB Locally (Mac)
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### Connect to MongoDB
```bash
mongo
use serenai
```

### Or Use MongoDB Atlas (Cloud)
1. Create account at mongodb.com/cloud
2. Create cluster
3. Get connection string
4. Add to .env as MONGODB_URI

---

## 📡 API ENDPOINTS

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "confirmPassword": "password123",
  "firstName": "John",
  "lastName": "Doe"
}

Response: { token, user }
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { token, user }
```

#### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response: { user }
```

### Mood Endpoints

#### Log Mood
```
POST /api/mood/
Authorization: Bearer <token>
Content-Type: application/json

{
  "moodScore": 7,
  "moodEmoji": "😊",
  "activities": ["exercise", "socializing"],
  "triggers": ["good weather"],
  "notes": "Had a great day today!",
  "energyLevel": 8,
  "sleepQuality": 9
}

Response: { mood }
```

#### Get Mood History
```
GET /api/mood/history?days=30&limit=50
Authorization: Bearer <token>

Response: { moods }
```

#### Get Mood Statistics
```
GET /api/mood/statistics?days=30
Authorization: Bearer <token>

Response: { stats: { averageMood, highestMood, lowestMood, trend, topTriggers, topActivities } }
```

---

## 🔌 Socket.IO Events (Real-time Mood Circles)

### Client to Server Events

#### Join Mood Circle
```javascript
socket.emit('join-mood-circle', {
  moodCircleId: '123abc',
  anonymousId: 'user_anon_123'
});
```

#### Send Message
```javascript
socket.emit('send-message', {
  moodCircleId: '123abc',
  anonymousId: 'user_anon_123',
  message: 'Today was challenging but I made it through',
  emotion: 'calm'
});
```

#### Like Message
```javascript
socket.emit('like-message', {
  moodCircleId: '123abc',
  messageId: 'msg_456def'
});
```

#### Typing Indicator
```javascript
socket.emit('typing', {
  moodCircleId: '123abc',
  anonymousId: 'user_anon_123'
});

socket.emit('stop-typing', {
  moodCircleId: '123abc',
  anonymousId: 'user_anon_123'
});
```

#### Leave Mood Circle
```javascript
socket.emit('leave-mood-circle', {
  moodCircleId: '123abc',
  anonymousId: 'user_anon_123'
});
```

### Server to Client Events

#### Member Joined
```javascript
socket.on('member-joined', (data) => {
  console.log('Member joined:', data.anonymousId);
});
```

#### New Message
```javascript
socket.on('new-message', (data) => {
  console.log('New message:', data);
});
```

#### Message Liked
```javascript
socket.on('message-liked', (data) => {
  console.log('Message liked:', data.messageId);
});
```

#### User Typing
```javascript
socket.on('user-typing', (data) => {
  console.log('User typing:', data.anonymousId);
});

socket.on('user-stop-typing', (data) => {
  console.log('User stopped typing:', data.anonymousId);
});
```

#### Member Left
```javascript
socket.on('member-left', (data) => {
  console.log('Member left:', data.anonymousId);
});
```

---

## 🏃 Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
NODE_ENV=production npm start
```

### Check Server Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "success",
  "message": "SerenAI API is running",
  "timestamp": "2025-10-31T..."
}
```

---

## 🧪 Testing Endpoints with cURL

### Register Example
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login Example
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Log Mood Example
```bash
curl -X POST http://localhost:5000/api/mood/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "moodScore": 7,
    "moodEmoji": "😊",
    "activities": ["exercise"],
    "notes": "Feeling good today"
  }'
```

---

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `brew services start mongodb-community`
- Check MONGODB_URI in .env

### JWT Errors
- Ensure JWT_SECRET is set in .env
- Include token in Authorization header: `Bearer <token>`

### Socket.IO Connection Issues
- Check CORS configuration in server.js
- Ensure CLIENT_URL matches your frontend URL

### Port Already in Use
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>
```

---

## 📚 Next Steps

1. **Create more controllers** for journal, MBTI, affirmations
2. **Add input validation** using express-validator
3. **Implement email notifications** using nodemailer
4. **Add image upload** support using multer
5. **Create dashboard routes** for analytics
6. **Add encryption** for sensitive data
7. **Deploy to cloud** (Heroku, Railway, Render)

---

## 🔐 Security Best Practices

✓ Use environment variables for secrets
✓ Hash passwords with bcryptjs
✓ Use JWT for authentication
✓ Implement rate limiting
✓ Validate all inputs
✓ Use HTTPS in production
✓ Enable CORS properly
✓ Sanitize MongoDB queries
✓ Use helmet for security headers
✓ Keep dependencies updated

---

## 📞 Support

For issues or questions:
- Check error logs in `logs/` directory
- Review MongoDB Atlas dashboard
- Test endpoints with Postman/Insomnia
- Check console for detailed error messages

Happy coding! 🚀💜
