import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import { Plus, LogOut, User, Calendar, Clock, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TaskStats from '../components/TaskStats';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { tasks, getOverdueTasks, getUpcomingTasks } = useTask();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    // Check for overdue and upcoming tasks for notifications
    const overdueTasks = getOverdueTasks();
    const upcomingTasks = getUpcomingTasks();

    if (overdueTasks.length > 0) {
      toast.error(`You have ${overdueTasks.length} overdue task(s)!`, {
        duration: 5000,
      });
    }

    if (upcomingTasks.length > 0) {
      toast(`${upcomingTasks.length} task(s) due soon!`, {
        icon: '⏰',
        duration: 4000,
      });
    }
  }, [tasks, getOverdueTasks, getUpcomingTasks]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'completed':
        return task.completed;
      case 'pending':
        return !task.completed;
      case 'high':
        return task.priority === 'high' && !task.completed;
      case 'overdue':
        return getOverdueTasks().some(overdueTask => overdueTask.id === task.id);
      default:
        return true;
    }
  });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <User className="user-icon" />
            <div>
              <h1>Welcome back, {user?.name}!</h1>
              <p>Manage your tasks efficiently</p>
            </div>
          </div>
          <div className="header-actions">
            <Link to="/calendar" className="calendar-btn">
              <Calendar size={20} />
              Calendar View
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <TaskStats />
        
        <div className="dashboard-controls">
          <div className="task-filters">
            <button 
              className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('all')}
            >
              All Tasks
            </button>
            <button 
              className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
            <button 
              className={filter === 'high' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('high')}
            >
              High Priority
            </button>
            <button 
              className={filter === 'overdue' ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setFilter('overdue')}
            >
              <AlertTriangle size={16} />
              Overdue
            </button>
          </div>
          
          <button onClick={handleAddTask} className="add-task-btn">
            <Plus size={20} />
            Add Task
          </button>
        </div>

        <TaskList 
          tasks={filteredTasks} 
          onEditTask={handleEditTask}
        />
      </main>

      {showTaskForm && (
        <TaskForm 
          task={editingTask}
          onClose={() => setShowTaskForm(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;