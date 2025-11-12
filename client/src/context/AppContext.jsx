import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { projectsAPI, tasksAPI, usersAPI } from '../services/api';

const AppContext = createContext();

const initialState = {
  projects: [],
  tasks: [],
  users: [],
  loading: false,
  error: null,
  lastLoadedProjectParticipants: {},
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload, loading: false, error: null };
    
    case 'SET_TASKS':
      return { ...state, tasks: action.payload, loading: false, error: null };
    
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload], loading: false, error: null };

    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project._id === action.payload._id ? action.payload : project
        ),
        loading: false,
        error: null
      };
    
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload], loading: false, error: null };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task._id === action.payload._id ? action.payload : task
        ),
        loading: false, error: null
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
        loading: false, error: null
      };

    case 'SET_USERS':
      return {
        ...state,
        users: action.payload,
        error: null
      };

    // Сохраняем последние загруженные участники проекта
    case 'SET_PROJECT_PARTICIPANTS':
      return {
        ...state,
        lastLoadedProjectParticipants: {
          ...state.lastLoadedProjectParticipants,
          [action.payload.projectId]: action.payload.participants,
        },
        error: null,
      };
    
    default:
      return state;
  }
};

const parseStoredUser = () => {
  const rawUser = localStorage.getItem('user');

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch (error) {
    console.error('Не удалось распарсить пользователя из localStorage:', error);
    return null;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [token, setToken] = useState(() => localStorage.getItem('accessToken'));
  const [currentUser, setCurrentUser] = useState(() => parseStoredUser());

  const clearAuth = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setToken(null);
    setCurrentUser(null);
    dispatch({ type: 'SET_PROJECTS', payload: [] });
    dispatch({ type: 'SET_TASKS', payload: [] });
    dispatch({ type: 'SET_USERS', payload: [] });
  }, [dispatch]);

  const syncAuthFromStorage = useCallback(() => {
    setToken(localStorage.getItem('accessToken'));
    setCurrentUser(parseStoredUser());
  }, []);

  const loadInitialData = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [projects, tasks] = await Promise.all([
        projectsAPI.getAll(),
        tasksAPI.getAll()
      ]);

      if (projects?.needLogin || tasks?.needLogin) {
        clearAuth();
        return;
      }
      
      dispatch({ type: 'SET_PROJECTS', payload: projects });
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [clearAuth, dispatch]);

  const loadUsers = useCallback(async () => {
    try {
      const users = await usersAPI.getAll();

      if (users?.needLogin) {
        clearAuth();
        return;
      }

      dispatch({ type: 'SET_USERS', payload: users });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, [clearAuth, dispatch]);

  useEffect(() => {
    const handleStorageChange = () => {
      syncAuthFromStorage();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [syncAuthFromStorage]);

  useEffect(() => {
    if (token) {
      loadInitialData();
    }
  }, [token, loadInitialData]);

  useEffect(() => {
    if (token && currentUser?.role === 'admin') {
      loadUsers();
    }
  }, [token, currentUser, loadUsers]);

  const getCurrentUser = useCallback(() => {
    const user = currentUser ?? parseStoredUser();
    if (!currentUser && user) {
      setCurrentUser(user);
    }
    return user;
  }, [currentUser]);

  const addProject = async (projectData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newProject = await projectsAPI.create(projectData);

      if (newProject?.needLogin) {
        clearAuth();
        return newProject;
      }

      dispatch({ type: 'ADD_PROJECT', payload: newProject });
      return newProject;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateProject = async (projectId, updates) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedProject = await projectsAPI.update(projectId, updates);

      if (updatedProject?.needLogin) {
        clearAuth();
        return updatedProject;
      }

      dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
      return updatedProject;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

   // Tasks actions
  const addTask = async (taskData) => {
    try {
      const user = getCurrentUser();
      if (!taskData.assignee && user?._id) {
        taskData.assignee = user._id;
      }
      dispatch({ type: 'SET_LOADING', payload: true });
      const newTask = await tasksAPI.create(taskData);
      if (newTask?.needLogin) {
        clearAuth();
        return newTask;
      }
      dispatch({ type: 'ADD_TASK', payload: newTask });
      return newTask;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateTask = async (taskData) => {
    try {
      const user = getCurrentUser();
      if (!taskData.assignee && user?._id) {
        taskData.assignee = user._id;
      }
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedTask = await tasksAPI.update(taskData._id, taskData);
      if (updatedTask?.needLogin) {
        clearAuth();
        return updatedTask;
      }
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      return updatedTask;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await tasksAPI.delete(taskId);
      if (response?.needLogin) {
        clearAuth();
        return response;
      }
      dispatch({ type: 'DELETE_TASK', payload: taskId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const refreshTasks = async () => {
    try {
      const tasks = await tasksAPI.getAll();
      if (tasks?.needLogin) {
        clearAuth();
        return;
      }
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const value = {
    ...state,
    currentUser,
    addProject,
    updateProject,
    addTask,
    updateTask,
    deleteTask,
    refreshTasks,
    loadUsers,
    syncAuthFromStorage,
    setCurrentUser,
    logout: clearAuth,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};