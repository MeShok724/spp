import express from 'express';
import { User } from '../models/User.js';
import { auth, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, 'login role createdAt');
    res.json(users);
  } catch (error) {
    console.error('❌ Ошибка получения списка пользователей:', error);
    res.status(500).json({ error: 'Не удалось получить список пользователей' });
  }
});

export default router;

