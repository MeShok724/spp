import { connectDB } from '../config/database.js';
import { User } from '../models/User.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';

const seedData = async () => {
  try {
    await connectDB();

    // Очистка коллекций
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();

    // Создание пользователей
    const users = await User.create([
      { login: 'admin', password: 'admin123', role: 'admin' },
      { login: 'user1', password: 'user123', role: 'user' }
    ]);

    // Создание проектов
    const projects = await Project.create([
      { 
        title: 'Веб-приложение', 
        description: 'Разработка клиентской части',
        participants: [users[0]._id, users[1]._id]
      },
      { 
        title: 'Мобильное приложение', 
        description: 'Кроссплатформенное мобильное приложение',
        participants: [users[1]._id]
      }
    ]);

    // Создание задач
    await Task.create([
      {
        title: 'Создать компоненты',
        description: 'Реализовать основные React компоненты',
        status: 'todo',
        assignee: users[1]._id,
        project: projects[0]._id
      },
      {
        title: 'Настроить маршрутизацию',
        description: 'Добавить React Router',
        status: 'inProgress',
        assignee: users[0]._id,
        project: projects[0]._id
      }
    ]);

    console.log('✅ Данные успешно загружены в MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Ошибка загрузки данных:', error);
    process.exit(1);
  }
};

seedData();