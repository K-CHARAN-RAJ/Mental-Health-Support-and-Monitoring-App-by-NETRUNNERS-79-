// serenai-backend/models/User.js
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Info
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 8,
    select: false
  },
  firstName: {
    type: String,
    required: [true, 'First name is required']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required']
  },
  
  // Profile
  avatar: String,
  bio: String,
  phone: String,
  
  // MBTI & Preferences
  mbtiType: {
    type: String,
    enum: ['ENFP', 'ENFJ', 'ENTJ', 'ENTP', 'ESFP', 'ESFJ', 'ESTJ', 'ESTP', 
           'INFP', 'INFJ', 'INTJ', 'INTP', 'ISFP', 'ISFJ', 'ISTJ', 'ISTP']
  },
  mbtiCompletedAt: Date,
  preferences: {
    notifications: { type: Boolean, default: true },
    emailUpdates: { type: Boolean, default: true },
    privateProfile: { type: Boolean, default: true },
    showInMoodCircles: { type: Boolean, default: false }
  },
  
  // Privacy & Security
  offlineMode: { type: Boolean, default: true },
  dataEncryption: { type: Boolean, default: true },
  emergencyContacts: [{
    name: String,
    phone: String,
    relationship: String
  }],
  
  // Wellness Goals
  wellnessGoals: [String],
  
  // Statistics
  stats: {
    totalMoodLogs: { type: Number, default: 0 },
    totalJournalEntries: { type: Number, default: 0 },
    moodCirclesJoined: { type: Number, default: 0 },
    consecutiveLoggingDays: { type: Number, default: 0 }
  },
  
  // Account Status
  isActive: { type: Boolean, default: true },
  emailVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  lastLoginAt: Date
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const { password, resetPasswordToken, verificationToken, ...publicProfile } = this.toObject();
  return publicProfile;
};

module.exports = mongoose.model('User', userSchema);
