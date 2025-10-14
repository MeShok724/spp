import { ProjectCard } from "./ProjectCard"

export const ProjectList = ({ projects, onProjectClick }) => {
  return (
    <div>
      <div className="row">
        {projects.map(project => (
          <div key={project.id} className="col-md-4">
            <ProjectCard 
              project={project} 
              onClick={() => onProjectClick(project)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};