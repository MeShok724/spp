import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';

import './models/User.js';
import './models/Project.js';
import './models/Task.js';

import projectsRouter from './routes/projects.js';
import tasksRouter from './routes/tasks.js';
import authRouter from './routes/auth.js'

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/auth', authRouter)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({ error: 'Route not found' });
// });

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});