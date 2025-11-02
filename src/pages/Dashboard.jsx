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

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      toast.error('Tiêu đề công việc là bắt buộc');
      return;
    }
    
    try {
      await addTask(taskTitle, taskDescription, taskDeadline);
      setTaskTitle('');
      setTaskDescription('');
      setTaskDeadline('');
      setShowAddForm(false);
      toast.success('Task đã được thêm thành công');
    } catch {
      toast.error('Không thể thêm task');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description || '');
    // Chỉ lấy phần ngày yyyy-MM-dd
    if (task.dueDate) {
      setTaskDeadline(task.dueDate.split('T')[0]);
    } else {
      setTaskDeadline('');
    }
    setShowAddForm(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      toast.error('Tiêu đề công việc là bắt buộc');
      return;
    }
    
    try {
      await updateTask(editingTask.id, { 
        title: taskTitle, 
        description: taskDescription, 
        dueDate: taskDeadline 
      });
      setTaskTitle('');
      setTaskDescription('');
      setTaskDeadline('');
      setEditingTask(null);
      setShowAddForm(false);
      toast.success('Task đã được cập nhật thành công');
    } catch {
      toast.error('Không thể cập nhật task');
    }
  };

  const handleDeleteTask = async (taskId, taskTitle) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa "${taskTitle}"?`)) {
      try {
        await deleteTask(taskId);
        toast.success('Task đã được xóa thành công');
      } catch {
        toast.error('Không thể xóa task');
      }
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await toggleTaskComplete(taskId);
      toast.success('Trạng thái công việc đã được cập nhật');
    } catch {
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingTask(null);
    setTaskTitle('');
    setTaskDescription('');
    setTaskDeadline('');
  };

  const completedTasks = tasks.filter(task => task.status === 'DONE').length;
  const pendingTasks = tasks.filter(task => task.status !== 'DONE').length;

  // Hàm kiểm tra task có overdue không
  const isTaskOverdue = (task) => {
    if (!task.dueDate || task.status === 'DONE') return false;
    const deadlineDate = task.dueDate.includes('T')
      ? new Date(task.dueDate)
      : new Date(`${task.dueDate}T23:59:59`);
    return deadlineDate < new Date();
  };

  // Sắp xếp tasks: Pending (chưa quá hạn) → Overdue → Completed
  const sortedTasks = [...tasks].sort((a, b) => {
    const aOverdue = isTaskOverdue(a);
    const bOverdue = isTaskOverdue(b);
    
    // Completed tasks xuống cuối cùng
    if (a.status === 'DONE' && b.status !== 'DONE') return 1;
    if (a.status !== 'DONE' && b.status === 'DONE') return -1;
    
    // Trong pending tasks: task chưa quá hạn lên trước, task overdue xuống sau
    if (a.status !== 'DONE' && b.status !== 'DONE') {
      if (!aOverdue && bOverdue) return -1; // a chưa overdue, b overdue → a lên trước
      if (aOverdue && !bOverdue) return 1;  // a overdue, b chưa overdue → b lên trước
    }
    
    // Cùng trạng thái (cùng overdue hoặc cùng pending), sắp xếp theo dueDate
    if (a.dueDate && b.dueDate) {
      const da = new Date(`${a.dueDate}T00:00`);
      const db = new Date(`${b.dueDate}T00:00`);
      return da - db;
    }
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    // Không có deadline, sắp xếp theo thời gian tạo
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
                  type="date"
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
            sortedTasks.map(task => {
              const isOverdue = isTaskOverdue(task);
              return (
                <div key={task.id} className={`task-card ${task.status === 'DONE' ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`}>
                  <div className="task-content">
                  <div className="task-header">
                    <h4 className={task.status === 'DONE' ? 'task-title completed' : 'task-title'}>
                      {task.title}
                    </h4>
                    <div className="task-actions">
                      <button 
                        onClick={() => handleToggleComplete(task.id)}
                        className={`toggle-btn ${task.status === 'DONE' ? 'completed' : 'pending'}`}
                      >
                        {task.status === 'DONE' ? '✓' : '○'}
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
                  
                  {task.dueDate && (
                    <div className="task-deadline">
                      <strong>Deadline:</strong> {(() => {
                        // Nếu dueDate có chữ T (có giờ), hiển thị cả ngày giờ
                        if (task.dueDate.includes('T')) {
                          return new Date(task.dueDate).toLocaleString('vi-VN');
                        } else {
                          // Chỉ có ngày, hiển thị dạng ngày
                          return new Date(task.dueDate).toLocaleDateString('vi-VN');
                        }
                      })()}
                      {isOverdue && (
                        <span className="overdue-badge"> (OVERDUE)</span>
                      )}
                    </div>
                  )}
                  
                  <small className="task-meta">
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;