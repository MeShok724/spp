import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { generateId } from '../utils/IdGeneration';
import { projectsAPI, tasksAPI } from '../services/api';

const AppContext = createContext();

const initialState = {
  projects: [],
  tasks: [],
  loading: false,
  error: null,
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
    
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload], loading: false, error: null };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
        loading: false, error: null
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        loading: false, error: null
      };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

   // Загрузка данных при старте
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [projects, tasks] = await Promise.all([
        projectsAPI.getAll(),
        tasksAPI.getAll()
      ]);
      
      dispatch({ type: 'SET_PROJECTS', payload: projects });
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // Projects actions
  const addProject = async (projectData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newProject = await projectsAPI.create(projectData);
      dispatch({ type: 'ADD_PROJECT', payload: newProject });
      return newProject;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

   // Tasks actions
  const addTask = async (taskData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newTask = await tasksAPI.create(taskData);
      dispatch({ type: 'ADD_TASK', payload: newTask });
      return newTask;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateTask = async (taskData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedTask = await tasksAPI.update(taskData.id, taskData);
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
      await tasksAPI.delete(taskId);
      dispatch({ type: 'DELETE_TASK', payload: taskId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const refreshTasks = async () => {
    try {
      const tasks = await tasksAPI.getAll();
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const value = {
    ...state,
    addProject,
    addTask,
    updateTask,
    deleteTask,
    refreshTasks
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