let tasks = [
  { id: '1', title: 'Создать компоненты', description: 'Реализовать основные компоненты приложения', assignee: 'Иван', status: 'todo', projectId: '1' },
  { id: '2', title: 'Настроить маршрутизацию', description: 'Добавить React Router', assignee: 'Петр', status: 'inProgress', projectId: '1' },
  { id: '3', title: 'Тестирование', description: 'Протестировать функциональность', assignee: 'Мария', status: 'done', projectId: '1' }
];

export const Task = {
  getAll: () => tasks,
  getByProjectId: (projectId) => tasks.filter(t => t.projectId === projectId),
  getById: (id) => tasks.find(t => t.id === id),
  create: (task) => {
    const newTask = { id: Date.now().toString(), ...task };
    tasks.push(newTask);
    return newTask;
  },
  update: (id, updates) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updates };
      return tasks[index];
    }
    return null;
  },
  delete: (id) => {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      return tasks.splice(index, 1)[0];
    }
    return null;
  }
};