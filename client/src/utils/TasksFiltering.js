export const filterTasksByStatus = (tasks, status) => {
  if (!tasks || !Array.isArray(tasks))
    return []
  return tasks.filter(task => task.status === status);
}