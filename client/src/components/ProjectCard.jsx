export const ProjectCard = ({ project, onClick, taskCount }) => {
  return (
    <div className="card mb-3" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="card-body">
        <h5 className="card-title">{project.title}</h5>
        <p className="card-text">Задач: {taskCount}</p>
      </div>
    </div>
  );
};