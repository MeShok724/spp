import { useState } from "react";
import { TaskEditForm } from './TaskEditForm'

export const TaskCard = ({ task, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false)

  const handleEdit = (updatedTask) => {
    setIsEditing(false);
    onEdit(updatedTask);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <TaskEditForm 
        task={task}
        onSubmit={handleEdit}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="card mb-2">
      <div className="card-body">
        <h6 className="card-title">{task.title}</h6>
        <p className="card-text small">{task.description}</p>
        <p className="card-text">
          <small className="text-muted">Исполнитель: {task.assignee}</small>
        </p>

        <div className="d-flex">
          <button 
            className="btn" 
            onClick={()=>{setIsEditing(true)}}
          >
            Редактировать
          </button>
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={() => {onDelete(task.id)}}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};