import { ProjectCard } from "./ProjectCard"

export const ProjectList = ({ projects, onProjectClick, tasks }) => {
  return (
    <div>
      <div className="row">
        {projects.map(project => (
          <div key={project.id} className="col-md-4">
            <ProjectCard 
              project={project} 
              onClick={() => onProjectClick(project)}
              taskCount={tasks.filter(task => String(task.projectId) === String(project.id)).length}
            />
          </div>
        ))}
      </div>
    </div>
  );
};