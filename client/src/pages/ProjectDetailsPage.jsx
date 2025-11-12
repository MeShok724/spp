import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskForm } from '../components/TaskForm';
import { useEffect, useMemo, useState } from "react";

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

  const participantIds = useMemo(() => {
    if (!project?.participants) {
      return [];
    }

    return project.participants
      .map(participant => (typeof participant === 'string' ? participant : participant?._id))
      .filter(Boolean);
  }, [project]);

  useEffect(() => {
    setSelectedParticipants(participantIds);
  }, [participantIds]);

  useEffect(() => {
    if (currentUser?.role === 'admin' && (!users || users.length === 0)) {
      loadUsers();
    }
  }, [currentUser, users, loadUsers]);
  
  if (!project)
    return <>
      Ошибка, проект не найден!
    </>

  const currentUserId = currentUser?._id;
  const canManageTasks = currentUser?.role === 'admin' || (currentUserId && participantIds.includes(currentUserId));

  const handleTaskCreate = (taskData) => {
    if (!canManageTasks) {
      return;
    }

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

  const normalizedParticipants = useMemo(() => {
    return participants.map(participant => {
      if (!participant) {
        return null;
      }
      if (typeof participant === 'string') {
        const userFromList = users?.find(user => user._id === participant);
        if (userFromList) {
          return userFromList;
        }
        return { _id: participant, login: participant };
      }
      return participant;
    }).filter(Boolean);
  }, [participants, users]);

  return (
    <div className="ps-5 mt-5 pt-5">
      <h2 className="mb-4">Проект {project.title}</h2>
      
      <div className="row gy-4 gx-5">
        <div className="col-md-8">
          <KanbanBoard 
            tasks={projectTasks} 
            onEdit={canManageTasks ? updateTask : undefined}
            onDelete={canManageTasks ? deleteTask : undefined}
            canManageTasks={canManageTasks}
            participants={normalizedParticipants}
          />
        </div>
        <div className="col-md-4">
          {canManageTasks ? (
            <TaskForm onSubmit={handleTaskCreate} participants={normalizedParticipants} />
          ) : (
            <div className="card border-0 bg-light h-100">
              <div className="card-body">
                <p className="text-muted mb-0">
                  У вас нет прав на управление задачами этого проекта.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3>Участники</h3>
        {normalizedParticipants.length > 0 ? (
          <ul className="list-unstyled">
            {normalizedParticipants.map(participant => {
              const participantId = participant?._id || participant;
              const participantName = participant?.login || participantId || 'Неизвестный пользователь';
              const participantRole = participant?.role;

              return (
                <li key={participantId}>
                  - {participantName}
                  {participantRole === 'admin' ? ' (администратор)' : ' (пользователь)'}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-muted">Участники не назначены.</p>
        )}

        {currentUser?.role === 'admin' && (
          <div className="mt-3">
            <h5 className="mb-3">Управление участниками</h5>
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