import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/database.js';

import './models/User.js';
import './models/Project.js';
import './models/Task.js';

import projectsRouter from './routes/projects.js';
import tasksRouter from './routes/tasks.js';
import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js';

// Получаем путь к текущей директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Настройка middleware
app.use(cors());              // Разрешаем CORS запросы
app.use(express.json());      // Парсим JSON в теле запроса

// Настройка статических файлов для раздачи загруженных файлов
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });  // Создаем директорию, если её нет
app.use('/uploads', express.static(uploadsDir)); // Раздаем файлы по пути /uploads

// Регистрация роутеров
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

// Проверка работоспособности сервера
app.get('/api/health', (req, res) => {
  res.json({ message: 'Сервер работает!' });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('Ошибка сервера:', err.stack);
  res.status(500).json({ error: 'Произошла ошибка на сервере!' });
});

// Запуск сервера после подключения к базе данных
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  });
});