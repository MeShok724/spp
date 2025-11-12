import { useAppContext } from '../context/AppContext';
import { ProjectList } from '../components/ProjectList';
import { ProjectForm } from '../components/ProjectForm';
import { useNavigate } from 'react-router-dom';

export function ProjectsPage(){
    const { projects, addProject, tasks, currentUser } = useAppContext();
    const navigate = useNavigate();
    const canCreateProject = currentUser?.role === 'admin';

    const handleProjectClick = (project) => {
        navigate(`/projects/${project._id}`);
    };

    return (
    <div>
      <h2>Проекты</h2> 
      
      <div className="row">
        <div className={canCreateProject ? 'col-md-8' : 'col-12'}>
          <ProjectList 
            projects={projects} 
            onProjectClick={handleProjectClick} 
            tasks={tasks}
          />
        </div>
        {canCreateProject && (
          <div className="col-md-4">
            <ProjectForm onSubmit={addProject} />
          </div>
        )}
      </div>
    </div>
  );
}