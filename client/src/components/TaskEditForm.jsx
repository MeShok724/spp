import { useState } from 'react';

export const TaskEditForm = ({ task, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [assignee, setAssignee] = useState(task.assignee);
  const [status, setStatus] = useState(task.status);

  const handleSubmit = () => {
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
            <input
              type="text"
              className="form-control"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            />
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