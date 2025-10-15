import express from 'express';
import { Project } from '../models/Project.js';

const router = express.Router();

// GET /api/projects - все проекты
router.get('/', (req, res) => {
  try {
    const projects = Project.getAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/projects/:id - проект по ID
router.get('/:id', (req, res) => {
  try {
    const project = Project.getById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/projects - создать проект
router.post('/', (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Название проекта обязательно' });
    }
    const project = Project.create({ title });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/projects/:id - обновить проект
router.put('/:id', (req, res) => {
  try {
    const project = Project.update(req.params.id, req.body);
    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/projects/:id - удалить проект
router.delete('/:id', (req, res) => {
  try {
    const project = Project.delete(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Проект не найден' });
    }
    res.json({ message: 'Проект удален', project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;