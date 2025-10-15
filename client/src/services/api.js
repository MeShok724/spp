const API_BASE_URL = 'http://localhost:5000/api';

// Общая функция для HTTP запросов
const fetchAPI = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Projects API
export const projectsAPI = {
  getAll: () => fetchAPI('/projects'),
  getById: (id) => fetchAPI(`/projects/${id}`),
  create: (project) => fetchAPI('/projects', {
    method: 'POST',
    body: JSON.stringify(project),
  }),
  update: (id, updates) => fetchAPI(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),
  delete: (id) => fetchAPI(`/projects/${id}`, {
    method: 'DELETE',
  }),
};

// Tasks API
export const tasksAPI = {
  getAll: () => fetchAPI('/tasks'),
  getByProjectId: (projectId) => fetchAPI(`/tasks/project/${projectId}`),
  getById: (id) => fetchAPI(`/tasks/${id}`),
  create: (task) => fetchAPI('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  }),
  update: (id, updates) => fetchAPI(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),
  delete: (id) => fetchAPI(`/tasks/${id}`, {
    method: 'DELETE',
  }),
};