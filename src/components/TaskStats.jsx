import { useTask } from '../context/TaskContext';
import { CheckCircle, Clock, AlertTriangle, Target } from 'lucide-react';

const TaskStats = () => {
  const { tasks, getOverdueTasks, getUpcomingTasks } = useTask();

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  const overdueTasks = getOverdueTasks().length;
  const upcomingTasks = getUpcomingTasks().length;

  const stats = [
    {
      icon: CheckCircle,
      label: 'Completed',
      value: completedTasks,
      color: 'stat-success'
    },
    {
      icon: Clock,
      label: 'Pending',
      value: pendingTasks,
      color: 'stat-warning'
    },
    {
      icon: AlertTriangle,
      label: 'Overdue',
      value: overdueTasks,
      color: 'stat-danger'
    },
    {
      icon: Target,
      label: 'Due Soon',
      value: upcomingTasks,
      color: 'stat-info'
    }
  ];

  return (
    <div className="task-stats">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-icon">
              <IconComponent size={24} />
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskStats;