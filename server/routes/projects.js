import express from 'express';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import {auth, adminOrMember, isAdmin} from '../middleware/auth.js'

const router = express.Router();

// GET /api/projects - все проекты с количеством задач
router.get('/', auth, async (req, res) => {
  try {
    console.log('🔍 GET /api/projects - запрос получен');
    const projects = await Project.find()
      .populate('participants', 'login role')
      .populate('taskCount');

    // console.log('✅ Найдено проектов:', projects.length);
    // console.log('📊 Проекты:', JSON.stringify(projects, null, 2));
    
    res.json(projects);
  } catch (error) {
    console.error('❌ Ошибка в GET /api/projects:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/projects/:id - проект по ID
router.get('/:id', auth, adminOrMember, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('participants', 'login role')
      .populate('taskCount');
    
    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/projects - создать проект
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    console.log('Request', req);
    const { title, description, participants } = req.body;
    
    const project = new Project({
      title,
      description,
      participants: participants || []
    });
    
    
    await project.save();
    await project.populate('participants', 'login role');
    
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/projects/:id - обновить проект
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('participants', 'login role');
    
    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/projects/:id - удалить проект
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    
    // Удаляем все задачи проекта
    await Task.deleteMany({ project: req.params.id });
    
    res.json({ message: 'Проект и связанные задачи удалены', project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;