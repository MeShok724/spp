import { TaskCard } from "./taskCard";

export const KanbanBoard = ({ tasks, onTaskMove }) => {
  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'inProgress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <div>
      <h3>Kanban доска</h3>
      <div className="row">
        {/* ToDo колонка */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-light">
              <h5 className="mb-0">To Do</h5>
            </div>
            <div className="card-body">
              {todoTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>

        {/* In Progress колонка */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-warning">
              <h5 className="mb-0">In Progress</h5>
            </div>
            <div className="card-body">
              {inProgressTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>

        {/* Done колонка */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-success">
              <h5 className="mb-0">Done</h5>
            </div>
            <div className="card-body">
              {doneTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};