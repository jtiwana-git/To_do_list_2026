import { useState } from "react";
import {
  Check,
  Edit3,
  Trash2,
  Clock,
  AlertCircle,
  Calendar,
  Save,
  X,
} from "lucide-react";
import { formatDate, IsTaskOverdue, getTaskPriority } from "../utils/index.js";

const TaskItem = ({ task, onToggleComplete, onDeleteTask, onEditTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate || "",
    reminderTime: task.reminderTime || "",
  });

  const isOverDue = IsTaskOverdue(task.dueDate);
  const priority = getTaskPriority(task.priority);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editData.title.trim()) return;
    onEditTask(task.id, {
      ...editData,
      title: editData.title.trim(),
      description: editData.description.trim(),
      dueDate: editData.dueDate || null,
      reminderTime: editData.reminderTime || null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate || "",
      reminderTime: task.reminderTime || "",
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isEditing) {
    return (
      <div className="card border-2 border-primary-200" key={task.key}>
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={handleChange}
            className="input-field font-medium"
            placeholder="Task Title...."
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={handleChange}
            rows="2"
            className="input-field resize-none"
            placeholder="Task Description...."
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={editData.priority}
                onChange={handleChange}
                className="input-field text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="datetime-local"
                name="dueDate"
                value={editData.dueDate}
                onChange={handleChange}
                className="input-field text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Reminder Time
            </label>
            <input
              type="datetime-local"
              name="reminderTime"
              value={editData.reminderTime}
              onChange={handleChange}
              className="input-field text-sm"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 bg-green-500 text-white hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm transition-colors "
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-1 bg-gray-500 text-white hover:bg-gray-400 text-white px-3 py-1 rounded-md text-sm transition-colors "
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`card transition-all duration-200 hover:shadow-md ${
        task.completed ? "opacity-75" : ""
      } ${isOverDue && !task.completed ? "border-l-4 border-red-50" : ""}`}
    >
      <div className="flex items-start space-x-4">
        <button
          onClick={() => onToggleComplete(task.id)}
          className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${task.completed ? "bg-green-500 border-green-500 text-white" : "border-gray-300 hover:border-primary-500"}`}
        >
          {task.completed && <Check className="w-4 h-4" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3
                key={task.id}
                className={`font-medium text-gray-900 ${task.completed ? "line-through text-gray-500" : ""}`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p
                  key={task.id}
                  className={`mt-1 text-sm text-gray-600 ${task.completed ? "line-through" : ""}`}
                >
                  {task.description}
                </p>
              )}
            </div>
            <span
              className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${priority.color}`}
            >
              {priority.label}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sx text-gray-500">
              {task.dueDate && (
                <div
                  className={`flex items-center space-x-1 ${isOverDue && !task.completed ? "text-red-500 font-medium" : ""}`}
                >
                  {isOverDue && !task.completed ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <Calendar className="w-4 h-4" />
                  )}
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
              {task.reminderTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(task.reminderTime)}</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="text-gray-400 hover:text-primary-500 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
