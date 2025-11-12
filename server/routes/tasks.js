import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import {auth, adminOrMember, adminOrMemberTask} from '../middleware/auth.js'

const router = express.Router();

// Получаем путь к текущей директории для работы с файлами
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Настройка директории для сохранения вложений задач
const uploadDir = path.join(__dirname, '..', 'uploads', 'tasks');
fs.mkdirSync(uploadDir, { recursive: true });

// Настройка хранилища для загружаемых файлов
const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, uploadDir);
  },
  // Генерируем уникальное имя файла: timestamp + случайное число + расширение
  filename: (_, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname) || '';
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

// Middleware для обработки загрузки файла
const upload = multer({ storage });

// Создает объект с информацией о вложении для сохранения в базе данных
const buildAttachment = (file) => ({
  filename: file.filename,
  originalName: file.originalname,
  mimeType: file.mimetype,
  size: file.size,
  url: `/uploads/tasks/${file.filename}`
});

// Удаляет файл вложения с диска
const deleteAttachmentFile = (attachment) => {
  if (!attachment?.filename) {
    return;
  }

  const filePath = path.join(uploadDir, attachment.filename);
  fs.promises.stat(filePath)
    .then(() => fs.promises.unlink(filePath).catch(() => {}))
    .catch(() => {});
};

// GET /api/tasks - все задачи
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignee', 'login role')
      .populate('project', 'title');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tasks/project/:projectId - задачи проекта
router.get('/project/:projectId', auth, adminOrMember, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignee', 'login role')
      .populate('project', 'title');
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tasks/:id - задача по ID
router.get('/:id', auth, adminOrMemberTask, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'login role')
      .populate('project', 'title');
    
    if (!task) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/tasks - создать задачу
router.post('/', auth, upload.single('attachment'), adminOrMember, async (req, res) => {
  try {
    const { title, description, status, project, assignee } = req.body;
    
    // Если исполнитель не указан, назначаем текущего пользователя
    const assigneeId = assignee || req.user._id;
    
    // Проверяем существование проекта
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    
    const task = new Task({
      title,
      description,
      status: status || 'todo',
      assignee: assigneeId,
      project,
      attachment: req.file ? buildAttachment(req.file) : undefined
    });
    
    await task.save();
    await task.populate('assignee', 'login role');
    await task.populate('project', 'title');
    
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/tasks/:id - обновить задачу
router.put('/:id', auth, adminOrMemberTask, upload.single('attachment'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }

    // Обновляем основные поля, если они переданы в запросе
    const { title, description, status, assignee } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (assignee !== undefined && assignee !== '') task.assignee = assignee;

    // Удаляем существующее вложение, если запрошено
    if (req.body.removeAttachment === 'true') {
      deleteAttachmentFile(task.attachment);
      task.attachment = undefined;
    }

    // Добавляем новое вложение
    if (req.file) {
      deleteAttachmentFile(task.attachment);
      task.attachment = buildAttachment(req.file);
    }

    await task.save();
    await task.populate('assignee', 'login role');
    await task.populate('project', 'title');

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/tasks/:id - удалить задачу
router.delete('/:id', auth, adminOrMemberTask, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }

    // Удаляем файл вложения с диска, если оно было
    deleteAttachmentFile(task.attachment);
    
    res.json({ message: 'Задача удалена', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;