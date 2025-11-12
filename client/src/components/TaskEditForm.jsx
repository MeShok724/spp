import { useEffect, useMemo, useRef, useState } from 'react';
import { API_ROOT } from '../services/api';

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
  const [attachmentFile, setAttachmentFile] = useState(null);
  const [removeAttachment, setRemoveAttachment] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setAssignee(initialAssigneeId);
    setAttachmentFile(null);
    setRemoveAttachment(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
      status,
      attachmentFile,
      removeAttachment
    });
  };

  const currentAttachmentUrl = task.attachment?.url
    ? (task.attachment.url.startsWith('http')
        ? task.attachment.url
        : `${API_ROOT}${task.attachment.url}`)
    : null;

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

          <div className="mb-3">
            <label className="form-label">Вложение</label>
            {task.attachment && !removeAttachment && !attachmentFile && (
              <div className="border rounded p-2 mb-2 d-flex flex-column gap-2">
                <span className="text-muted small">Текущее вложение:</span>
                {currentAttachmentUrl ? (
                  <a
                    href={currentAttachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    {task.attachment.originalName ?? 'Скачать файл'}
                  </a>
                ) : (
                  <span>{task.attachment.originalName ?? 'Файл'}</span>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger align-self-start"
                  onClick={() => {
                    setRemoveAttachment(true);
                    setAttachmentFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  Удалить вложение
                </button>
              </div>
            )}

            {attachmentFile && (
              <div className="border rounded p-2 mb-2 d-flex justify-content-between align-items-center">
                <span className="small text-muted text-truncate me-3">{attachmentFile.name}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => {
                    setAttachmentFile(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = '';
                    }
                  }}
                >
                  Очистить
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              className="form-control"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setAttachmentFile(file);
                if (file) {
                  setRemoveAttachment(false);
                }
              }}
            />
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