import { ProjectList } from "../components/ProjectList";
import { KanbanBoard } from "../components/KanbanBoard";
import { useState } from "react";
import TaskForm from "../components/TaskForm";
import { generateId } from "../utils/IdGeneration";

export function MainPage(){
    const [projects, setProjects] = useState([
        { id: 1, title: 'Веб-приложение', taskCount: 3 },
        { id: 2, title: 'Мобильное приложение', taskCount: 2 },
        { id: 3, title: 'Документация', taskCount: 1 }
    ]);
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Создать компоненты', description: 'Реализовать основные компоненты приложения', assignee: 'Иван', status: 'todo', projectId: 1 },
        { id: 2, title: 'Настроить маршрутизацию', description: 'Добавить React Router', assignee: 'Петр', status: 'inProgress', projectId: 1 },
        { id: 3, title: 'Тестирование', description: 'Протестировать функциональность', assignee: 'Мария', status: 'done', projectId: 1 },
        { id: 4, title: 'Дизайн интерфейса', description: 'Создать макеты экранов', assignee: 'Анна', status: 'todo', projectId: 2 },
        { id: 5, title: 'Интеграция API', description: 'Подключить бэкенд API', assignee: 'Сергей', status: 'done', projectId: 2 },
        { id: 6, title: 'Написать документацию', description: 'Описать API и архитектуру', assignee: 'Дмитрий', status: 'inProgress', projectId: 3 }
    ]);

    return (
    <div className="container mt-4">
      <ProjectList 
        projects={projects} 
        onProjectClick={(project) => console.log('Выбран проект:', project)} 
      />
      
      <hr className="my-5" />
      
      <KanbanBoard tasks={tasks} 
        onEdit={(updatedTask) => {setTasks(tasks.map(task=>task.id===updatedTask.id?updatedTask:task))}} 
        onDelete={(id)=>{setTasks(tasks.filter(task=>task.id !== id))}}
      />
      
      <hr className="my-5" />
      
      <TaskForm onSubmit={(taskData) => {
        const newTask = {
          id: generateId(),
          ...taskData,
          projectId: 1
        };
        setTasks([...tasks, newTask]);
      }} />
    </div>
  )
}