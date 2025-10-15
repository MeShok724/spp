import express from 'express';
import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';

const router = express.Router();

// GET /api/tasks - все задачи
router.get('/', (req, res) => {
  console.log(`все задачи`);
  try {
    const tasks = Task.getAll();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tasks/project/:projectId - задачи проекта
router.get('/project/:projectId', (req, res) => {
  console.log(`задачи проекта`);
  try {
    const tasks = Task.getByProjectId(req.params.projectId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tasks/:id - задача по ID
router.get('/:id', (req, res) => {
  console.log(`задача по ID`);
  try {
    const task = Task.getById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Задача не найден' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/tasks - создать задачу
router.post('/', (req, res) => {
  console.log(`создать задачу`);
  try {
    const { title, description, assignee, status, projectId } = req.body;
    
    if (!title || !projectId) {
      return res.status(400).json({ error: 'Название и projectId обязательны' });
    }

    const task = Task.create({
      title,
      description: description || '',
      assignee: assignee || '',
      status: status || 'todo',
      projectId
    });

    // Обновляем счетчик задач в проекте
    Project.incrementTaskCount(projectId);

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/tasks/:id - обновить задачу
router.put('/:id', (req, res) => {
  console.log(`обновить задачу`);
  try {
    const task = Task.update(req.params.id, req.body);
    if (!task) {
      return res.status(404).json({ error: 'Задача не найден' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/tasks/:id - удалить задачу
router.delete('/:id', (req, res) => {
  console.log(`удалить задачу`);
  try {
    const task = Task.getById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Задача не найден' });
    }

    Task.delete(req.params.id);
    
    // Обновляем счетчик задач в проекте
    Project.decrementTaskCount(task.projectId);

    res.json({ message: 'Задача удалена', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;