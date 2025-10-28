import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Генерация токенов
export const generateTokens = (payload) => {
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || 'access-secret',
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || 'refresh-secret',
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Верификация access токена
export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Токен не предоставлен' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'access-secret');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access token истек' });
    }
    console.error('❌ Ошибка проверки access token:', error);
    res.status(401).json({ error: 'Неверный access token' });
  }
};

// Верификация refresh токена
export const verifyRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'refresh-secret');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    
    return user;
  } catch (error) {
    throw error;
  }
};

export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Недостаточно прав для выполнения операции' 
      });
    }

    next();
  };
};