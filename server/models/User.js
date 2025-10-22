import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  refreshTokens: [{
    token: String,
    expiresAt: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Хеширование пароля перед сохранением
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Метод для проверки пароля
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Метод для добавления refresh токена
userSchema.methods.addRefreshToken = function(token, expiresInDays = 7) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + expiresInDays);
  
  this.refreshTokens.push({
    token,
    expiresAt
  });
  
  // Ограничиваем количество активных токенов
  if (this.refreshTokens.length > 5) {
    this.refreshTokens = this.refreshTokens.slice(-5);
  }

  return this.save();
};

// Метод для проверки и удаления refresh токена
userSchema.methods.validateRefreshToken = async function(token) {
  const now = new Date();
  
  // Удаляем просроченные токены
  this.refreshTokens = this.refreshTokens.filter(
    t => t.expiresAt > now
  );
  
  const validToken = this.refreshTokens.find(
    t => t.token === token && t.expiresAt > now
  );
  
  await this.save();
  return !!validToken;
};

// Метод для удаления refresh токена
userSchema.methods.removeRefreshToken = function(token) {
  this.refreshTokens = this.refreshTokens.filter(t => t.token !== token);
  return this.save();
};

// Метод для удаления всех refresh токенов
userSchema.methods.clearRefreshTokens = function() {
  this.refreshTokens = [];
  return this.save();
};

export const User = mongoose.model('User', userSchema);