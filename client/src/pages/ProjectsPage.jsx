import { useAppContext } from '../context/AppContext';
import { ProjectList } from '../components/ProjectList';
import { ProjectForm } from '../components/ProjectForm';
import { useNavigate } from 'react-router-dom';

export function ProjectsPage(){
    const { projects, addProject, tasks } = useAppContext();
    const navigate = useNavigate();

    const handleProjectClick = (project) => {
        navigate(`/projects/${project._id}`);
    };

    return (
    <div>
      <h2>Проекты</h2> 
      
      <div className="row">
        <div className="col-md-8">
          <ProjectList 
            projects={projects} 
            onProjectClick={handleProjectClick} 
            tasks={tasks}
          />
        </div>
        <div className="col-md-4">
          <ProjectForm onSubmit={addProject} />
        </div>
      </div>
    </div>
  );
}