import express from 'express';
import { User } from '../models/User.js';
import { generateTokens, verifyRefreshToken, auth } from '../middleware/auth.js';
import crypto from 'crypto';

const router = express.Router();

// Генерация уникального refresh токена
const generateSecureToken = () => {
  return crypto.randomBytes(40).toString('hex');
};

// POST /auth/register - регистрация
router.post('/register', async (req, res) => {
  try {
    const { login, password, role = 'user' } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: 'Логин и пароль обязательны' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Пароль должен содержать минимум 6 символов' });
    }

    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return res.status(400).json({ error: 'Пользователь с таким логином уже существует' });
    }

    const user = new User({ login, password, role });
    await user.save();

    // Генерируем токены
    const payload = { userId: user._id, login: user.login, role: user.role };
    const { accessToken, refreshToken } = generateTokens(payload);

    // Сохраняем refresh токен в базе
    const secureRefreshToken = generateSecureToken();
    await user.addRefreshToken(secureRefreshToken);


    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      user: {
        _id: user._id,
        login: user.login,
        role: user.role,
        createdAt: user.createdAt
      },
      tokens: {
        accessToken,
        refreshToken: secureRefreshToken
      }
    });

  } catch (error) {
    console.error('❌ Ошибка регистрации:', error);
    res.status(500).json({ error: 'Ошибка при регистрации пользователя' });
  }
});

// POST /auth/login - вход
router.post('/login', async (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({ error: 'Логин и пароль обязательны' });
    }

    const user = await User.findOne({ login });
    if (!user) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    const isPasswordValid = await user.correctPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Неверный логин или пароль' });
    }

    // Генерируем токены
    const payload = { userId: user._id, login: user.login, role: user.role };
    const { accessToken, refreshToken } = generateTokens(payload);
    
    // Сохраняем refresh токен в базе
    const secureRefreshToken = generateSecureToken();
    await user.addRefreshToken(secureRefreshToken);

    res.json({
      message: 'Вход выполнен успешно',
      user: {
        _id: user._id,
        login: user.login,
        role: user.role,
        createdAt: user.createdAt
      },
      tokens: {
        accessToken,
        refreshToken: secureRefreshToken
      }
    });

  } catch (error) {
    console.error('❌ Ошибка входа:', error);
    res.status(500).json({ error: 'Ошибка при входе в систему' });
  }
});

// POST /auth/refresh - обновление токенов
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token обязателен' });
    }

    // Верифицируем refresh token
    const user = await verifyRefreshToken(refreshToken);
    
    // Генерируем новые токены
    const payload = { userId: user._id, login: user.login, role: user.role };
    const { accessToken, refreshToken: newJwtRefreshToken } = generateTokens(payload);
    
    // Удаляем старый refresh token и добавляем новый
    await user.removeRefreshToken(refreshToken);
    const newSecureRefreshToken = generateSecureToken();
    await user.addRefreshToken(newSecureRefreshToken);

    res.json({
      message: 'Токены обновлены',
      tokens: {
        accessToken,
        refreshToken: newSecureRefreshToken
      }
    });

  } catch (error) {
    console.error('❌ Ошибка обновления токенов:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token истек' });
    }
    
    res.status(401).json({ error: 'Неверный refresh token' });
  }
});

// GET /auth/me - информация о текущем пользователе
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

// POST /auth/logout - выход (на клиенте удаляем токен)
router.post('/logout', auth, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const user = await User.findOne({ 'refreshTokens.token': refreshToken });
      if (user) {
        await user.removeRefreshToken(refreshToken);
      }
    }

    res.json({ message: 'Выход выполнен успешно' });
  } catch (error) {
    console.error('❌ Ошибка выхода:', error);
    res.status(500).json({ error: 'Ошибка при выходе из системы' });
  }
});

export default router;