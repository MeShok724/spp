import { useState } from "react";

export const TaskForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignee, setAssignee] = useState('');
  const [status, setStatus] = useState('todo');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      assignee,
      status
    });
    setTitle('');
    setDescription('');
    setAssignee('');
    setStatus('todo');
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
          
          <button type="submit" className="btn btn-primary">
            Создать задачу
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;