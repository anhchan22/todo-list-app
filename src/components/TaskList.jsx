import { useTask } from '../context/TaskContext';
import { Edit2, Trash2, CheckCircle, Circle, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const TaskList = ({ tasks, onEditTask }) => {
  const { deleteTask, toggleTaskComplete } = useTask();

  const handleDelete = (taskId, taskTitle) => {
    if (window.confirm(`Are you sure you want to delete "${taskTitle}"?`)) {
      deleteTask(taskId);
      toast.success('Task deleted successfully');
    }
  };

  const handleToggleComplete = (taskId, currentStatus) => {
    toggleTaskComplete(taskId);
    toast.success(currentStatus ? 'Task marked as pending' : 'Task completed!');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-medium';
    }
  };

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return null;
    try {
      return format(new Date(deadline), 'MMM dd, yyyy HH:mm');
    } catch (error) {
      return deadline;
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>No tasks found</h3>
        <p>Create your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
          <div className="task-header">
            <div className="task-status-title">
              <button 
                onClick={() => handleToggleComplete(task.id, task.completed)}
                className="task-status-btn"
              >
                {task.completed ? (
                  <CheckCircle className="status-icon completed" />
                ) : (
                  <Circle className="status-icon pending" />
                )}
              </button>
              <div className="task-title-section">
                <h3 className={task.completed ? 'task-title completed' : 'task-title'}>
                  {task.title}
                </h3>
                <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                  {task.priority.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="task-actions">
              <button 
                onClick={() => onEditTask(task)}
                className="action-btn edit-btn"
              >
                <Edit2 size={16} />
              </button>
              <button 
                onClick={() => handleDelete(task.id, task.title)}
                className="action-btn delete-btn"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          {task.deadline && (
            <div className={`task-deadline ${isOverdue(task.deadline) && !task.completed ? 'overdue' : ''}`}>
              {isOverdue(task.deadline) && !task.completed ? (
                <AlertTriangle size={16} />
              ) : (
                <Clock size={16} />
              )}
              <span>
                {isOverdue(task.deadline) && !task.completed ? 'Overdue: ' : 'Due: '}
                {formatDeadline(task.deadline)}
              </span>
            </div>
          )}

          <div className="task-meta">
            <small>
              Created: {format(new Date(task.createdAt), 'MMM dd, yyyy')}
            </small>
            {task.updatedAt !== task.createdAt && (
              <small>
                Updated: {format(new Date(task.updatedAt), 'MMM dd, yyyy')}
              </small>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;