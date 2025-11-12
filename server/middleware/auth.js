import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';

// Генерирует пару токенов (access и refresh) для пользователя
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

// Middleware для проверки авторизации пользователя
// Проверяет access token и добавляет информацию о пользователе в req.user
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

    // Добавляем информацию о пользователе в объект запроса
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Access token истек' });
    }
    console.error('Ошибка проверки access token:', error);
    res.status(401).json({ error: 'Неверный access token' });
  }
};

// Проверяет refresh token и возвращает пользователя
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

// Middleware для проверки доступа: разрешает доступ администраторам и участникам проекта
export const adminOrMember = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    const projectId = req.params.id || req.params.projectId || req.body.project;
    const userId = req.user._id;

    // Администраторы имеют доступ ко всем проектам
    if (req.user.role === 'admin') {
      return next();
    }

    // Проверяем существование проекта
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }

    // Проверяем, является ли пользователь участником проекта
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

// Middleware для проверки прав администратора
export const isAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    // Проверяем, является ли пользователь администратором
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Требуются права администратора' });
    }
    next();
  } catch (error) {
    console.error('Ошибка проверки прав администратора:', error);
    res.status(500).json({ error: 'Ошибка проверки доступа' });
  }
}

// Middleware для проверки доступа к задаче: разрешает доступ администраторам и участникам проекта задачи
export const adminOrMemberTask = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Требуется авторизация' });
    }

    const userId = req.user._id;
    const taskId = req.params.taskId || req.params.id;

    // Администраторы имеют доступ ко всем задачам
    if (req.user.role === 'admin') {
      return next();
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    // Получаем проект, к которому относится задача
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
    console.error('Ошибка проверки доступа к задаче:', error);
    res.status(500).json({ error: 'Ошибка проверки доступа' });
  }
};