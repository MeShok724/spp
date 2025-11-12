import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskForm } from '../components/TaskForm';
import { useEffect, useState } from "react";

export const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { projects, tasks, addTask, updateTask, deleteTask, currentUser, users, updateProject, loadUsers } = useAppContext();
  const [projectTasks, setProjectTasks] = useState([]); // задачи проекта
  const [selectedParticipants, setSelectedParticipants] = useState([]); // выбранные участники
  const [isSavingParticipants, setIsSavingParticipants] = useState(false); // состояние сохранения списка участников
  const [participantFeedback, setParticipantFeedback] = useState(null); // сообщение о результате сохранения списка участников

  // фильтруем задачи проекта
  useEffect(() => {
      const filteredTasks = tasks.filter(task => 
        task.project === id || 
        task.project?._id === id
      );
      setProjectTasks(filteredTasks);
    }, [tasks, id]);
  
  const project = projects.find(p => String(p._id) === String(id))

  useEffect(() => {
    if (project?.participants) {
      const participantIds = project.participants.map(participant => {
        if (typeof participant === 'string') {
          return participant;
        }
        return participant?._id;
      }).filter(Boolean);
      setSelectedParticipants(participantIds);
    } else {
      setSelectedParticipants([]);
    }
  }, [project]);

  useEffect(() => {
    if (currentUser?.role === 'admin' && (!users || users.length === 0)) {
      loadUsers();
    }
  }, [currentUser, users, loadUsers]);
  
  if (!project)
    return <>
      Ошибка, проект не найден!
    </>

  const handleTaskCreate = (taskData) => {
    addTask({
      ...taskData,
      project: id
    });
  };

  const handleParticipantToggle = (userId) => {
    setParticipantFeedback(null);
    setSelectedParticipants(prev => 
      prev.includes(userId)
        ? prev.filter(idValue => idValue !== userId)
        : [...prev, userId]
    );
  };

  const handleSaveParticipants = async () => {
    try {
      setIsSavingParticipants(true);
      setParticipantFeedback(null);
      const updatedProject = await updateProject(project._id, { participants: selectedParticipants });

      if (updatedProject?.needLogin) {
        setParticipantFeedback({ type: 'error', message: 'Сессия истекла, выполните вход заново.' });
        return;
      }

      setParticipantFeedback({ type: 'success', message: 'Список участников обновлён.' });
    } catch (error) {
      setParticipantFeedback({ type: 'error', message: error.message || 'Не удалось обновить участников.' });
    } finally {
      setIsSavingParticipants(false);
    }
  };

  const participants = Array.isArray(project.participants) ? project.participants : [];

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

      <div className="mt-4">
        <h3>Участники</h3>
        {participants.length > 0 ? (
          <ul className="list-unstyled">
            {participants.map(participant => {
              const participantId = typeof participant === 'string' ? participant : participant?._id;
              const participantName = typeof participant === 'object' ? participant?.login : participantId;
              const participantRole = typeof participant === 'object' ? participant?.role : null;

              return (
                <li key={participantId}>
                  {participantName || 'Неизвестный пользователь'}
                  {participantRole === 'admin' ? ' (администратор)' : '(пользователь)'}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-muted">Участники не назначены.</p>
        )}

        {currentUser?.role === 'admin' && (
          <div className="mt-3">
            {participantFeedback && (
              <div className={`alert alert-${participantFeedback.type === 'error' ? 'danger' : 'success'}`}>
                {participantFeedback.message}
              </div>
            )}

            <div className="mb-3" style={{ maxHeight: '240px', overflowY: 'auto' }}>
              {(users || []).map(user => (
                <div className="form-check" key={user._id}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={`participant-${user._id}`}
                    checked={selectedParticipants.includes(user._id)}
                    onChange={() => handleParticipantToggle(user._id)}
                    disabled={isSavingParticipants}
                  />
                  <label className="form-check-label" htmlFor={`participant-${user._id}`}>
                    {user.login} {user.role === 'admin' ? '(администратор)' : ''}
                  </label>
                </div>
              ))}
              {users && users.length === 0 && (
                <p className="text-muted mb-0">Доступные пользователи не найдены.</p>
              )}
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSaveParticipants}
              disabled={isSavingParticipants}
            >
              {isSavingParticipants ? 'Сохранение...' : 'Сохранить участников'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};