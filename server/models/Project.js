let projects = [
  { id: '1', title: 'Веб-приложение' },
  { id: '2', title: 'Мобильное приложение' },
  { id: '3', title: 'Документация' }
];

export const Project = {
  getAll: () => projects,
  getById: (id) => projects.find(p => p.id === id),
  create: (project) => {
    const newProject = { id: Date.now().toString(), ...project };
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
};