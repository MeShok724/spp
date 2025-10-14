import { ProjectList } from "../components/ProjectList";
import { KanbanBoard } from "../components/KanbanBoard";
import { useState, createContext, useContext, useReducer } from "react";
import TaskForm from "../components/TaskForm";
import { generateId } from "../utils/IdGeneration";
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export function MainPage(){

    const { projects, tasks, addTask, updateTask, deleteTask } = useAppContext();

    const navigate = useNavigate();
    const handleProjectClick = (project) => {
        navigate(`/projects/${project.id}`);
    };

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