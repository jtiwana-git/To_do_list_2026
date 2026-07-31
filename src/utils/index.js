export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-UK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const IsTaskOverdue = (dueDate) => {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date();
};

export const getTaskPriority = (priority) => {
  const priorities = {
    low: { color: "bg-green-100 text-green-800", label: "Low" },
    medium: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
    high: { color: "bg-red-100 text-red-800", label: "High" },
  };
  return priorities[priority] || priorities.medium;
};

export const filterTasks = (tasks, filter) => {
  switch (filter) {
    case "completed":
      return tasks.filter((task) => task.completed);
    case "pending":
      return tasks.filter((task) => !task.pending);
    case "overdue":
      return tasks.filter(
        (task) => !task.completed && IsTaskOverdue(task.dueDate),
      );
    default:
      return tasks;
  }
};

export const sortTasks = (tasks, sortBy) => {
  const sortedTasks = [...tasks];

  switch (sortBy) {
    case "dueDate":
      return sortedTasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    case "priority":
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return sortedTasks.sort(
        (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority],
      );
    case "name":
      return sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sortedTasks.sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      );
  }
};
