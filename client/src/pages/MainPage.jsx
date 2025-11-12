import { useMemo } from "react";
import { ProjectList } from "../components/ProjectList";
import { KanbanBoard } from "../components/KanbanBoard";
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export function MainPage(){
    const { projects, tasks, loading, error, updateTask, deleteTask, currentUser } = useAppContext();

    const navigate = useNavigate();
    const handleProjectClick = (project) => {
        navigate(`/projects/${project._id}`);
    };

    // Список проектов пользователя
    const userProjects = useMemo(() => {
      if (!currentUser) {
        return [];
      }

      if (currentUser.role === 'admin') {
        return projects;
      }

      // Фильтруем проекты по участникам
      return projects.filter(project => {
        if (!Array.isArray(project.participants)) {
          return false;
        }
        return project.participants.some(participant => {
          if (typeof participant === 'string') {
            return participant === currentUser._id;
          }
          return participant?._id === currentUser._id;
        });
      });
    }, [projects, currentUser]);

    // Список ID проектов пользователя
    const userProjectIds = useMemo(() => {
      return new Set(userProjects.map(project => String(project._id)));
    }, [userProjects]);

    // Список задач пользователя
    const userTasks = useMemo(() => {
      return tasks.filter(task => {
        const projectId = typeof task.project === 'object' ? task.project?._id : task.project;
        if (!projectId) {
          return false;
        }
        return userProjectIds.has(String(projectId));
      });
    }, [tasks, userProjectIds]);

    if (!currentUser) {
      return (
        <div className="container mt-5 pt-4">
          <div className="alert alert-info">
            Для просмотра проектов необходимо <button className="btn btn-link p-0 align-baseline" onClick={() => navigate('/login')}>войти в систему</button>.
          </div>
        </div>
      );
    }

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
          <div className="alert alert-danger d-flex align-items-center justify-content-between">
            <span>Ошибка загрузки: {error}</span>
            <button 
              className="btn btn-sm btn-outline-danger ms-3"
              onClick={() => window.location.reload()}
            >
              Перезагрузить
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="container mt-5 pt-5 ps-5">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className="mb-0">Мои проекты</h2>
          <span className="text-muted">Всего: {userProjects.length}</span>
        </div>

        {userProjects.length === 0 ? (
          <div className="alert alert-secondary">
            Вы пока не участвуете ни в одном проекте.
          </div>
        ) : (
          <ProjectList 
            projects={userProjects} 
            onProjectClick={handleProjectClick} 
            tasks={tasks}
          />
        )}
        
        <hr className="my-5" />
        
        <div className="mb-4 d-flex align-items-center justify-content-between">
          <h3 className="mb-0">Задачи моих проектов</h3>
          <span className="text-muted">Всего: {userTasks.length}</span>
        </div>

        {userTasks.length === 0 ? (
          <div className="alert alert-light border">
            Для проектов, в которых вы участвуете, нет задач.
          </div>
        ) : (
          <KanbanBoard 
            tasks={userTasks} 
            onEdit={updateTask} 
            onDelete={deleteTask}
            canManageTasks={true}
          />
        )}
      </div>
    )
}