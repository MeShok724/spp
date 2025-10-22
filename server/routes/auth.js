import express from 'express';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { auth } from '../middleware/auth.js';

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

    const token = jwt.sign(
      { userId: user._id, login: user.login, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'Пользователь успешно зарегистрирован',
      user: {
        _id: user._id,
        login: user.login,
        role: user.role,
        createdAt: user.createdAt
      },
      token
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

    const token = jwt.sign(
      { userId: user._id, login: user.login, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Вход выполнен успешно',
      user: {
        _id: user._id,
        login: user.login,
        role: user.role,
        createdAt: user.createdAt
      },
      token
    });

  } catch (error) {
    console.error('❌ Ошибка входа:', error);
    res.status(500).json({ error: 'Ошибка при входе в систему' });
  }
});

// GET /auth/me - информация о текущем пользователе
router.get('/me', auth, (req, res) => {
  res.json({ user: req.user });
});

// POST /auth/logout - выход (на клиенте удаляем токен)
router.post('/logout', auth, (req, res) => {
  res.json({ message: 'Выход выполнен успешно' });
});

export default router;