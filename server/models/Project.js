let projects = [
  { id: '1', title: 'Веб-приложение', taskCount: 3 },
  { id: '2', title: 'Мобильное приложение', taskCount: 2 },
  { id: '3', title: 'Документация', taskCount: 1 }
];

export const Project = {
  getAll: () => projects,
  getById: (id) => projects.find(p => p.id === id),
  create: (project) => {
    const newProject = { id: Date.now().toString(), ...project, taskCount: 0 };
    projects.push(newProject);
    return newProject;
  },
  update: (id, updates) => {
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      return projects[index];
    }
    return null;
  },
  delete: (id) => {
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      return projects.splice(index, 1)[0];
    }
    return null;
  },
  incrementTaskCount: (id) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      project.taskCount++;
    }
  },
  decrementTaskCount: (id) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      project.taskCount = Math.max(0, project.taskCount - 1);
    }
  }
};