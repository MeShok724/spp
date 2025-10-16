import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskForm } from '../components/TaskForm';

export const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { projects, tasks, addTask, updateTask, deleteTask } = useAppContext();
  
  const projectTasks = tasks.filter(task => String(task.projectId) === String(id));
  const project = projects.find(p => String(p.id) === String(id))

  const handleTaskCreate = (taskData) => {
    addTask({
      ...taskData,
      projectId: parseInt(id)
    });
  };

  return (
    <div>
      <h2>Проект {project.title}</h2>
      
      <div className="row">
        <div className="col-md-8">
          <KanbanBoard 
            tasks={projectTasks} 
            onEdit={updateTask}
            onDelete={deleteTask}
          />
        </div>
        <div className="col-md-4">
          <TaskForm onSubmit={handleTaskCreate} />
        </div>
      </div>
    </div>
  );
};