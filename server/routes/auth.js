import express from 'express';
import { User } from '../models/User.js';
import { generateTokens, verifyRefreshToken, auth } from '../middleware/auth.js';

const router = express.Router();

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
        refreshToken
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
        refreshToken
      }
    });

  } catch (error) {
    console.error('❌ Ошибка входа:', error);
    res.status(500).json({ error: 'Ошибка при входе в систему' });
  }
});

// POST /auth/refresh - обновление токенов
router.post('/refresh', auth, async (req, res) => {
  try {
    const { refreshToken } = req.body;

    console.log('Refresh token: ', refreshToken)
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token обязателен' });
    }

    // Верифицируем refresh token
    const user = await verifyRefreshToken(refreshToken);
    
    // Генерируем новые токены
    const payload = { userId: user._id, login: user.login, role: user.role };
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(payload);
    

    res.json({
      message: 'Токены обновлены',
      tokens: {
        accessToken,
        refreshToken: newRefreshToken
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

export default router;