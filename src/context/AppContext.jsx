import React, { createContext, useContext, useReducer } from 'react';
import { generateId } from '../utils/IdGeneration';

const AppContext = createContext();

const initialState = {
  projects: [
    { id: 1, title: 'Веб-приложение', taskCount: 3 },
    { id: 2, title: 'Мобильное приложение', taskCount: 2 },
    { id: 3, title: 'Документация', taskCount: 1 }
  ],
  tasks: [
    { id: 1, title: 'Создать компоненты', description: 'Реализовать основные компоненты приложения', assignee: 'Иван', status: 'todo', projectId: 1 },
    { id: 2, title: 'Настроить маршрутизацию', description: 'Добавить React Router', assignee: 'Петр', status: 'inProgress', projectId: 1 },
    { id: 3, title: 'Тестирование', description: 'Протестировать функциональность', assignee: 'Мария', status: 'done', projectId: 1 },
    { id: 4, title: 'Дизайн интерфейса', description: 'Создать макеты экранов', assignee: 'Анна', status: 'todo', projectId: 2 },
    { id: 5, title: 'Интеграция API', description: 'Подключить бэкенд API', assignee: 'Сергей', status: 'done', projectId: 2 },
    { id: 6, title: 'Написать документацию', description: 'Описать API и архитектуру', assignee: 'Дмитрий', status: 'inProgress', projectId: 3 }
  ]
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload]
      };
    
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        projects: state.projects.map(project => 
          project.id === action.payload.projectId 
            ? { ...project, taskCount: project.taskCount + 1 }
            : project
        )
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        )
      };
    
    case 'DELETE_TASK':
      const deletedTask = state.tasks.find(task => task.id === action.payload);
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        projects: state.projects.map(project => 
          project.id === deletedTask?.projectId 
            ? { ...project, taskCount: Math.max(0, project.taskCount - 1) }
            : project
        )
      };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Действия
  const addProject = (project) => {
    dispatch({
      type: 'ADD_PROJECT',
      payload: { ...project, id: generateId(), taskCount: 0 }
    });
  };

  const addTask = (task) => {
    dispatch({
      type: 'ADD_TASK',
      payload: { ...task, id: generateId() }
    });
  };

  const updateTask = (task) => {
    dispatch({
      type: 'UPDATE_TASK',
      payload: task
    });
  };

  const deleteTask = (taskId) => {
    dispatch({
      type: 'DELETE_TASK',
      payload: taskId
    });
  };

  const value = {
    projects: state.projects,
    tasks: state.tasks,
    addProject,
    addTask,
    updateTask,
    deleteTask
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