import express from 'express';
import { Task } from '../models/Task.js';
import { Project } from '../models/Project.js';
import { User } from '../models/User.js'
import {auth, adminOrMember, isAdmin, adminOrMemberTask} from '../middleware/auth.js'

const router = express.Router();

// GET /api/tasks - все задачи
router.get('/', auth, async (req, res) => {
  try {
    console.log('🔍 GET /api/tasks - запрос получен');
    const tasks = await Task.find()
      .populate('assignee', 'login role')
      .populate('project', 'title');
    
    // console.log('✅ Найдено задач:', tasks.length);
    // console.log('📊 Задачи:', JSON.stringify(tasks, null, 2));
    res.json(tasks);
  } catch (error) {
    console.error('❌ Ошибка в GET /api/tasks:', error);
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
router.post('/', auth, adminOrMember, async (req, res) => {
  try {
    const { title, description, status, assignee, project } = req.body;
    
    // Проверяем существование проекта
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    
    const task = new Task({
      title,
      description,
      status: status || 'todo',
      assignee,
      project
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
router.put('/:id', auth, adminOrMemberTask, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
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

// DELETE /api/tasks/:id - удалить задачу
router.delete('/:id', auth, adminOrMemberTask, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    
    res.json({ message: 'Задача удалена', task });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;