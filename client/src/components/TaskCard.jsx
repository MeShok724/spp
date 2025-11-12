import { useState } from "react";
import { TaskEditForm } from './TaskEditForm'
import { API_ROOT } from '../services/api';

export const TaskCard = ({ task, onEdit, onDelete, canManage = true, participants = [] }) => {
  const [isEditing, setIsEditing] = useState(false)

  const getAssigneeName = () => {
    if (!task.assignee) return 'Не назначен';
    if (typeof task.assignee === 'string') return task.assignee;
    return task.assignee.login || 'Неизвестный';
  };

  const attachmentUrl = task.attachment?.url
    ? (task.attachment.url.startsWith('http')
        ? task.attachment.url
        : `${API_ROOT}${task.attachment.url}`)
    : null;

  const handleEdit = (updatedTask) => {
    setIsEditing(false);
    onEdit?.(updatedTask);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing && canManage && onEdit) {
    return (
      <TaskEditForm 
        task={task}
        onSubmit={handleEdit}
        onCancel={handleCancel}
        participants={participants}
      />
    );
  }

  return (
    <div className="card mb-2" style={{ minWidth: '140px' }}>
      <div className="card-body">
        <h6 className="card-title">{task.title}</h6>
        <p className="card-text small">{task.description}</p>
        <p className="card-text">
          <small className="text-muted">Исполнитель: {getAssigneeName()}</small>
        </p>
        {task.attachment && (
          <p className="card-text small">
            <small className="text-muted">Вложение: </small>
            {attachmentUrl ? (
              <a
                href={attachmentUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {task.attachment.originalName ?? 'Скачать файл'}
              </a>
            ) : (
              <span>{task.attachment.originalName ?? 'Файл'}</span>
            )}
          </p>
        )}

        {canManage && (
          <div className="d-flex flex-wrap gap-2">
            {onEdit && (
              <button 
                className="btn btn-sm btn-outline-primary" 
                onClick={() => { setIsEditing(true); }}
              >
                Редактировать
              </button>
            )}
            {onDelete && (
              <button 
                className="btn btn-sm btn-outline-danger"
                onClick={() => { onDelete(task._id); }}
              >
                Удалить
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};