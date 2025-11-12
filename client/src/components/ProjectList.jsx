import { ProjectCard } from "./ProjectCard"

const getProjectTasksCount = (project, tasks) => {

  // Приоритет отдаём серверному значению, если оно определено
  if (typeof project.taskCount === 'number') {
    return project.taskCount;
  }
  
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return typeof project.taskCount === 'number' ? project.taskCount : 0;
  }

  const projectId = String(project._id);
  let count = 0;

  for (const task of tasks) {
    const taskProjectId = typeof task.project === 'object' ? task.project?._id : task.project;
    if (taskProjectId && String(taskProjectId) === projectId) {
      count += 1;
    }
  }
  

  return count;
};

export const ProjectList = ({ projects, onProjectClick, tasks }) => {
  return (
    <div>
      <div className="row">
        {projects.map(project => (
          <div key={project._id} className="col-md-4">
            <ProjectCard 
              project={project} 
              onClick={() => onProjectClick(project)}
              taskCount={getProjectTasksCount(project, tasks)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};