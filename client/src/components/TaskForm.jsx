import { useEffect, useMemo, useRef, useState } from "react";

// Функция для нормализации списка участников
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

// Компонент формы создания задачи
export const TaskForm = ({ onSubmit, participants }) => {
  const normalizedParticipants = useMemo(
    () => normalizeParticipants(participants),
    [participants]
  );

  // Состояние формы
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [status, setStatus] = useState('todo');
  const [attachmentFile, setAttachmentFile] = useState(null);
  const fileInputRef = useRef(null);

  // Установка исполнителя по умолчанию
  useEffect(() => {
    if (normalizedParticipants.length > 0 && !assignee) {
      setAssignee(normalizedParticipants[0]._id);
    }
  }, [normalizedParticipants, assignee]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!assignee) {
      return;
    }

    onSubmit({
      title,
      description,
      assignee,
      status,
      attachmentFile
    });
    setTitle('');
    setDescription('');
    setAssignee(normalizedParticipants[0]?._id ?? '');
    setStatus('todo');
    setAttachmentFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h5 className="mb-0">Новая задача</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
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
          
          {/* Исполнитель */}
          <div className="mb-3">
            <label className="form-label">Исполнитель</label>
            {normalizedParticipants.length === 0 ? (
              <input
                type="text"
                className="form-control"
                value="В проекте нет участников"
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

          {/*Вложение */}
          <div className="mb-4">
            <label className="form-label">Вложение</label>
            <input
              ref={fileInputRef}
              type="file"
              className="form-control"
              onChange={(e) => setAttachmentFile(e.target.files?.[0] ?? null)}
            />
            {attachmentFile && (
              <small className="text-muted d-block mt-2">
                Выбран файл: {attachmentFile.name}
              </small>
            )}
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={normalizedParticipants.length === 0}>
            Создать задачу
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;