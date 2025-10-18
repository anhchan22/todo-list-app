import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { tasks, addTask, updateTask, deleteTask, toggleTaskComplete } = useTask();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDeadline, setTaskDeadline] = useState('');

  const handleLogout = () => {
    logout();
    toast.success('Đăng xuất thành công');
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      toast.error('Tiêu đề công việc là bắt buộc');
      return;
    }
    
    addTask(taskTitle, taskDescription, taskDeadline);
    setTaskTitle('');
    setTaskDescription('');
    setTaskDeadline('');
    setShowAddForm(false);
    toast.success('Task đã được thêm thành công');
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
    setTaskDeadline(task.deadline ? task.deadline.slice(0, 16) : '');
    setShowAddForm(true);
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      toast.error('Tiêu đề công việc là bắt buộc');
      return;
    }
    
    updateTask(editingTask.id, { title: taskTitle, description: taskDescription, deadline: taskDeadline });
    setTaskTitle('');
    setTaskDescription('');
    setTaskDeadline('');
    setEditingTask(null);
    setShowAddForm(false);
    toast.success('Task đã được cập nhật thành công');
  };

  const handleDeleteTask = (taskId, taskTitle) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${taskTitle}"?`)) {
      deleteTask(taskId);
      toast.success('Task đã được xóa thành công');
    }
  };

  const handleToggleComplete = (taskId) => {
    toggleTaskComplete(taskId);
    toast.success('Trạng thái công việc đã được cập nhật');
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingTask(null);
    setTaskTitle('');
    setTaskDescription('');
    setTaskDeadline('');
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;

  // Sắp xếp tasks theo deadline
  const sortedTasks = [...tasks].sort((a, b) => {
    // Completed tasks xuống cuối
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    
    // Nếu cả hai đều pending hoặc completed, sắp xếp theo deadline
    if (a.deadline && b.deadline) {
      return new Date(a.deadline) - new Date(b.deadline);
    }
    if (a.deadline && !b.deadline) return -1; // Có deadline lên trước
    if (!a.deadline && b.deadline) return 1;  // Không có deadline xuống sau
    
    // Nếu không có deadline, sắp xếp theo thời gian tạo
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Welcome back, {user?.name}!</h1>
            <p>Manage your tasks efficiently</p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="task-stats">
          <div className="stat-card-total">
            <h3>{tasks.length}</h3>
            <p>Total Tasks</p>
          </div>
          <div className="stat-card-pending">
            <h3>{pendingTasks}</h3>
            <p>Pending</p>
          </div>
          <div className="stat-card-completed">
            <h3>{completedTasks}</h3>
            <p>Completed</p>
          </div>
        </div>

        <div className="dashboard-controls">
          <button 
            onClick={() => setShowAddForm(true)} 
            className="add-task-btn"
          >
            + Add Task
          </button>
        </div>

        {showAddForm && (
          <div className="task-form-container">
            <form onSubmit={editingTask ? handleUpdateTask : handleAddTask} className="task-form">
              <h3>{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
              
              <div className="form-group">
                <label htmlFor="title">Task Title</label>
                <input
                  type="text"
                  id="title"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Enter task description"
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="deadline">Deadline</label>
                <input
                  type="datetime-local"
                  id="deadline"
                  value={taskDeadline}
                  onChange={(e) => setTaskDeadline(e.target.value)}
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={cancelForm} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingTask ? 'Update Task' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="task-list">
          {tasks.length === 0 ? (
            <div className="empty-state">
              <h3>No tasks yet</h3>
              <p>Create your first task to get started!</p>
            </div>
          ) : (
            sortedTasks.map(task => (
              <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                <div className="task-content">
                  <div className="task-header">
                    <h4 className={task.completed ? 'task-title completed' : 'task-title'}>
                      {task.title}
                    </h4>
                    <div className="task-actions">
                      <button 
                        onClick={() => handleToggleComplete(task.id)}
                        className={`toggle-btn ${task.completed ? 'completed' : 'pending'}`}
                      >
                        {task.completed ? '✓' : '○'}
                      </button>
                      <button 
                        onClick={() => handleEditTask(task)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id, task.title)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  
                  {task.deadline && (
                    <div className="task-deadline">
                      <strong>Deadline:</strong> {new Date(task.deadline).toLocaleString('vi-VN')}
                      {new Date(task.deadline) < new Date() && !task.completed && (
                        <span className="overdue-badge"> (Overdue)</span>
                      )}
                    </div>
                  )}
                  
                  <small className="task-meta">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;