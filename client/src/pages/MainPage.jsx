import { ProjectList } from "../components/ProjectList";
import { KanbanBoard } from "../components/KanbanBoard";
import { useState, createContext, useContext, useReducer } from "react";
import TaskForm from "../components/TaskForm";
import { generateId } from "../utils/IdGeneration";
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export function MainPage(){

    const {  projects, tasks, loading, error, addTask, updateTask, deleteTask  } = useAppContext();

    const navigate = useNavigate();
    const handleProjectClick = (project) => {
        navigate(`/projects/${project.id}`);
    };

    if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
        <p className="mt-2">Загрузка данных...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          Ошибка загрузки: {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-2"
            onClick={() => window.location.reload()}
          >
            Перезагрузить
          </button>
        </div>
      </div>
    );
  }

    return (
      <div className="container mt-4">
        <h5 className="p-5">Проекты</h5>
        <ProjectList 
          projects={projects} 
          onProjectClick={handleProjectClick} 
        />
        
        <hr className="my-5" />
        
        <KanbanBoard tasks={tasks} 
          onEdit={updateTask} 
          onDelete={deleteTask}
        />
        
        <hr className="my-5" />
        
        <TaskForm onSubmit={addTask} />
      </div>
    )
}