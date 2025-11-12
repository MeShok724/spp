const API_BASE_URL = 'http://localhost:5000/api';

// Общая функция для HTTP запросов
const fetchAPI = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      // если истек токен - не выбрасываем исключение
      if (response.status === 401)
        return {needLogin: true};
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
  getAll: () => fetchAPIToken('/projects'),
  getById: (id) => fetchAPIToken(`/projects/${id}`),
  create: (project) => fetchAPIToken('/projects', {
    method: 'POST',
    body: JSON.stringify(project),
  }),
  update: (id, updates) => fetchAPIToken(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),
  delete: (id) => fetchAPIToken(`/projects/${id}`, {
    method: 'DELETE',
  }),
};

// Tasks API
export const tasksAPI = {
  getAll: () => fetchAPIToken('/tasks'),
  getByProjectId: (projectId) => fetchAPIToken(`/tasks/project/${projectId}`),
  getById: (id) => fetchAPIToken(`/tasks/${id}`),
  create: (task) => fetchAPIToken('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  }),
  update: (id, updates) => fetchAPIToken(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  }),
  delete: (id) => fetchAPIToken(`/tasks/${id}`, {
    method: 'DELETE',
  }),
};

export const usersAPI = {
  getAll: () => fetchAPIToken('/users'),
};

async function fetchAPIToken(url, options = {}) {
  try {
    let accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken) {
      console.warn("⚠️ Нет access токена, запрос без авторизации");
    }

    // Добавляем токен в заголовок
    options.headers = {
      ...(options.headers || {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
    };


    let res = await fetchAPI(url, options);

    // Если токен истёк — обновляем
    if (res.needLogin) {
      const refreshRes = await fetch("http://localhost:5000/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const refreshData = await refreshRes.json();

      if (!refreshRes.ok) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return { needLogin: true };
      }

      // сохраняем новые токены
      localStorage.setItem("accessToken", refreshData.accessToken);
      accessToken = refreshData.accessToken;
      localStorage.setItem("refreshToken", refreshData.refreshToken);

      // повторяем запрос с новым токеном
      options.headers.Authorization = `Bearer ${accessToken}`;
      res = await fetchAPI(url, options);
    }

    return res;
  } catch (error) {
    console.error('Авторизованный запрос завершился ошибкой:', error);
    throw error;
  }
  
}