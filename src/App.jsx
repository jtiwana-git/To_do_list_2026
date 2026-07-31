import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import Sidebar from "./components/Sidebar.jsx";
import TaskList from "./components/TaskList.jsx";
import AddTaskForm from "./components/AddTaskForm.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { IsTaskOverdue } from "./utils/index.js";

function App() {
  const [tasks, setTasks] = useLocalStorage("tasks", []);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentView, setCurrentView] = useState("dashboard");
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [reminders, setReminders] = useState(new Set());

  const taskCounts = {
    total: tasks.length,
    pending: tasks.filter((task) => !task.completed).length,
    completed: tasks.filter((task) => task.completed).length,
    overdue: tasks.filter(
      (task) => !task.completed && IsTaskOverdue(task.dueDate),
    ).length,
  };

  const handleAddTask = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);

    if (newTask.reminderTime) {
      setupReminder(newTask);
    }
  };

  const handleToggleComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const handleEditTask = (taskId, updatedData) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, ...updatedData } : task,
      ),
    );
    const updatedTask = {
      ...tasks.find((t) => t.id === taskId),
      ...updatedData,
    };
    if (updatedTask.reminderTime) {
      setupReminder(updatedTask);
    }
  };

  const setupReminder = (task) => {
    if (!task.reminderTime) return;

    const reminderDate = new Date(task.reminderTime);
    const now = new Date();
    const timeDifference = reminderDate.getTime() - now.getTime();

    if (timeDifference > 0) {
      setTimeout(() => {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(`Reminder: ${task.title}`, {
            body: task.description || "",
          });
        }
        alert(`Reminder: ${task.title} \n ${task.description || ""}`);
      }, timeDifference);
    }
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    tasks.forEach((task) => {
      if (task.reminderTime && !task.completed) {
        const reminderKey = `${task.id}-${task.reminderTime}`;
        if (!reminders.has(reminderKey)) {
          setupReminder(task);
          setReminders((prev) => new Set([...prev, reminderKey]));
        }
      }
    });
  }, [tasks]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentView("tasks");
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view === "dashboard") {
      setActiveFilter("all");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeFilter={currentView === "dashboard" ? "all" : activeFilter}
        onFilterChange={handleFilterChange}
        taskCounts={taskCounts}
      />
      <div className="flex-1 flex flex-col">
        <div className="bg-white shadow-sm border-b brorder-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleViewChange("dashboard")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "dashboard"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleViewChange("tasks")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === "tasks"
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Tasks
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <div className="text-sm text-gray-600">
                {new Date().toLocaleString("en-UK", {
                  day: "numeric",
                  weekday: "long",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>
        </div>
        {currentView === "dashboard" ? (
          <Dashboard tasks={tasks} />
        ) : (
          <TaskList
            tasks={tasks}
            filter={activeFilter}
            onToggleComplete={handleToggleComplete}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
          />
        )}
      </div>
      <AddTaskForm
        onAddTask={handleAddTask}
        isOpen={isAddFormOpen}
        onToggle={() => setIsAddFormOpen(!isAddFormOpen)}
      />
    </div>
  );
}

export default App;
