import { useEffect, useMemo, useState } from 'react';

const normalizeParticipants = (participants) => {
  if (!Array.isArray(participants)) {
    return [];
  }

  return participants
    .map((participant) => {
      if (!participant) {
        return null;
      }
      if (typeof participant === 'string') {
        return { _id: participant, login: participant };
      }
      return {
        _id: participant._id,
        login: participant.login ?? participant._id,
        role: participant.role,
      };
    })
    .filter(Boolean);
};

export const TaskEditForm = ({ task, onSubmit, onCancel, participants }) => {
  const normalizedParticipants = useMemo(
    () => normalizeParticipants(participants),
    [participants]
  );
  const initialAssigneeId = useMemo(() => {
    if (!task.assignee) {
      return '';
    }
    if (typeof task.assignee === 'string') {
      return task.assignee;
    }
    return task.assignee._id ?? '';
  }, [task.assignee]);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [assignee, setAssignee] = useState(initialAssigneeId);
  const [status, setStatus] = useState(task.status);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setAssignee(initialAssigneeId);
  }, [task, initialAssigneeId]);

  useEffect(() => {
    if (!assignee && normalizedParticipants.length > 0) {
      setAssignee(normalizedParticipants[0]._id);
    }
  }, [normalizedParticipants, assignee]);

  const handleSubmit = () => {
    if (!assignee) {
      return;
    }

    onSubmit({
      
      ...task,
      title,
      description,
      assignee,
      status
    });
  };

  return (
    <div className="card" style={{ minWidth: '140px' }}>
      <div className="card-header">
        <h5 className="mb-0">Редактировать задачу</h5>
      </div>
      <div className="card-body">
        <div>
          <div className="mb-3">
            <label className="form-label">Название</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Описание</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="mb-3">
            <label className="form-label">Исполнитель</label>
            {normalizedParticipants.length === 0 ? (
              <input
                type="text"
                className="form-control"
                value={typeof assignee === 'string' ? assignee : 'Исполнитель не выбран'}
                disabled
              />
            ) : (
              <select
                className="form-select"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                required
              >
                {normalizedParticipants.map((participant) => (
                  <option key={participant._id} value={participant._id}>
                    {participant.login}
                  </option>
                ))}
              </select>
            )}
          </div>
          
          <div className="mb-3">
            <label className="form-label">Статус</label>
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          
          <div className="d-flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary" onClick={handleSubmit}>
              Сохранить
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};