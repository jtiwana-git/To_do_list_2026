import { useState } from "react";
import { Search, SortAsc, Filter } from "lucide-react";
import TaskItem from "./TaskItem";
import { filterTasks, sortTasks } from "../utils/index.js";

const TaskList = ({
  tasks,
  filter,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");

  const filteredTasks = filterTasks(tasks, filter);
  const searchedTasks = filteredTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const sortedTasks = sortTasks(searchedTasks, sortBy);

  const getFilterTitle = () => {
    switch (filter) {
      case "completed":
        return "Completed Tasks";
      case "pending":
        return "Pending Tasks";
      case "overdue":
        return "Overdue Tasks";
      default:
        return "All Tasks";
    }
  };

  return (
    <div className="flex-1 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {getFilterTitle()}
        </h2>
        <p className="text-gray-600">
          {sortedTasks.length} {sortedTasks.length === 1 ? "task" : "tasks"}{" "}
          found
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-10 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none bg-white min-w-[140px]"
          >
            <option value="createdAt">Latest</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>
      <div className="space-y-4">
        {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
            />
          ))
        ) : (
          // Render the list of tasks

          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Filter className="h-12 w-12 text-gray-400 " />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No tasks found" : "No tasks yet"}
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              {searchTerm
                ? `No task matched - "${searchTerm}". Changed your search.`
                : `You haven't added any tasks yet. Start by creating a new task to get started!`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
