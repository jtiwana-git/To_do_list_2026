import { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Target,
} from "lucide-react";

import { IsTaskOverdue, formatDate } from "../utils/index.js";

const Dashboard = ({ tasks }) => {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    CompletionRate: 0,
  });
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const pending = tasks.filter((task) => !task.completed).length;
    const overdue = tasks.filter((task) => IsTaskOverdue(task)).length;
    const CompletionRate = total > 0 ? (completed / total) * 100 : 0;

    setStats({
      total,
      completed,
      pending,
      overdue,
      CompletionRate,
    });

    const now = new Date();

    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const upcoming = tasks
      .filter((task) => !task.completed && task.dueDate)
      .filter((task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= now && dueDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);

    setUpcomingTasks(upcoming);
  }, [tasks]);

  const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ percentage }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );

  return (
    <div className="flex-1 p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome to your dashboard, here is your overview
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Target}
          title="Total Tasks"
          value={stats.total}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          icon={CheckCircle}
          title="Completed"
          value={stats.completed}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          icon={Clock}
          title="Pending"
          value={stats.pending}
          color="text-yellow-600"
          bgColor="bg-yellow-100"
        />
        <StatCard
          icon={AlertTriangle}
          title="Overdue"
          value={stats.overdue}
          color="text-red-600"
          bgColor="bg-red-100"
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Progess Overview
            </h3>
            <TrendingUp className="w-5 h-5 text-primary-500" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Completion rate</span>
              <span className="font-semibold text-gray-900">
                {stats.CompletionRate}%
              </span>
            </div>
            <ProgressBar percentage={stats.CompletionRate} />

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.completed}
                </div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </div>
                <div className="text-xs text-gray-500">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.overdue}
                </div>
                <div className="text-xs text-gray-500">Overdue</div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-500">Quick Stats</h3>
            <Calendar className="w-5 h-5 text-primary-500" />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Today's Tasks</span>
              <span className="font-medium">
                {
                  tasks.filter((task) => {
                    if (!task.dueDate) return false;
                    const today = new Date().toDateString();
                    const taskDate = new Date(task.dueDate).toDateString();
                    return today === taskDate;
                  }).length
                }
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">This week</span>
              <span className="font-medium">
                {
                  tasks.filter((task) => {
                    if (!task.dueDate) return false;
                    const now = new Date();
                    const weekStart = new Date(
                      now.setDate(now.getDate() - now.getDay()),
                    );
                    const weekEnd = new Date(
                      now.setDate(now.getDate() - now.getDay() + 6),
                    );
                    const taskDate = new Date(task.dueDate);
                    return taskDate >= weekStart && taskDate <= weekEnd;
                  }).length
                }
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">High Priority</span>
              <span className="font-medium text-red-500">
                {tasks.filter((task) => task.priority === "high").length}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Upcoming Tasks
          </h3>
          <Calendar className="w-5 h-5 text-primary-500" />
        </div>
        {upcomingTasks.length > 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">
              No upcoming tasks in the next 7 days
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {task.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    Due: {formatDate(task.dueDate)}
                  </p>
                </div>
                <div className="ml-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${task.priority === "high" ? "bg-red-100 text-red-800" : task.priority === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
