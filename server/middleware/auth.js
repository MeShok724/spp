import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';

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

export const adminOrMember = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    const projectId = req.params.id || req.params.projectId || req.body.project;
    const userId = req.user._id;

    // Если админ — пропускаем сразу
    if (req.user.role === 'admin') {
      return next();
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Проект не найден в middleware' });
    }

    // Проверяем, что пользователь — участник проекта
    const isMember = project.participants.some(p => p.equals(userId));

    if (!isMember) {
      return res.status(403).json({ error: 'Нет доступа к проекту' });
    }
    next();
  } catch (error) {
    console.error('Ошибка проверки доступа к проекту:', error);
    res.status(500).json({ error: 'Ошибка проверки доступа' });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    // Если админ — пропускаем сразу
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Нет доступа к проекту' });
    }
    next();
  } catch (error) {
    console.error('Ошибка проверки доступа isAdmin:', error);
    res.status(500).json({ error: 'Ошибка проверки доступа' });
  }
}

export const adminOrMemberTask = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    const userId = req.user._id;
    const taskId = req.params.taskId || req.params.id;

    // Если админ — пропускаем сразу
    if (req.user.role === 'admin') {
      return next();
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    const projectId = task.project;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }

    // Проверяем, что пользователь — участник проекта
    const isMember = project.participants.some(participant => participant.equals(userId));

    if (!isMember) {
      return res.status(403).json({ error: 'Нет доступа к проекту' });
    }
    next();
  } catch (error) {
    console.error('Ошибка проверки доступа к проекту:', error);
    res.status(500).json({ error: 'Ошибка проверки доступа' });
  }
};