import { useState } from "react";
import { TaskEditForm } from './TaskEditForm'

export const TaskCard = ({ task, onEdit, onDelete, canManage = true }) => {
  const [isEditing, setIsEditing] = useState(false)

  const getAssigneeName = () => {
    if (!task.assignee) return 'Не назначен';
    if (typeof task.assignee === 'string') return task.assignee;
    return task.assignee.login || 'Неизвестный';
  };

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