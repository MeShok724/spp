export const ProjectCard = ({ project, onClick, taskCount }) => {
  const displayTaskCount = typeof taskCount === 'number'
    ? taskCount
    : typeof project.taskCount === 'number'
      ? project.taskCount
      : 0;

  return (
    <div className="card mb-3" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="card-body">
        <h5 className="card-title">{project.title}</h5>
        <p className="card-text">Задач: {displayTaskCount}</p>
      </div>
    </div>
  );
};