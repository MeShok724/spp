

export const TaskCard = ({ task }) => {
  return (
    <div className="card mb-2">
      <div className="card-body">
        <h6 className="card-title">{task.title}</h6>
        <p className="card-text small">{task.description}</p>
        <p className="card-text">
          <small className="text-muted">Исполнитель: {task.assignee}</small>
        </p>
      </div>
    </div>
  );
};