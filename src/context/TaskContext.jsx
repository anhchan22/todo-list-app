import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getMyTasksAPI, createTaskAPI, updateTaskAPI, deleteTaskAPI, assignTaskAPI } from '../API/taskAPI';
import { useNavigate } from 'react-router-dom';

const TaskContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Lấy danh sách tasks từ API
  const loadTasks = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      console.log('Loading tasks from API...');
      const tasksData = await getMyTasksAPI();
      console.log('Tasks loaded:', Array.isArray(tasksData) ? tasksData.length : tasksData);
      setTasks(tasksData);
      return tasksData;
    } catch (error) {
      console.error('Lỗi khi tải tasks:', error);
      if (error.message === 'UNAUTHORIZED') {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load tasks khi user đăng nhập
  useEffect(() => {
    if (user) {
      loadTasks();
    } else {
      setTasks([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Thêm task mới
  const addTask = async (title, description = '', dueDate = '') => {
    if (!user) return null;

    try {
      console.log('Adding task:', { title, description, dueDate });
      const created = await createTaskAPI({ title, description, dueDate });
      console.log('Task created from API:', created);

      // Gán task cho user hiện tại
      if (created?.id && (!created.user || created.user.id !== user.id)) {
        try {
          await assignTaskAPI(created.id, user.id);
        } catch (e) {
          console.warn('Assign after create failed (non-blocking):', e?.message);
        }
      }

      // Hiển thị task ngay
      if (created) {
        setTasks(prev => [created, ...prev]);
      }
      
      // Reload danh sách tasks từ server để đồng bộ
      await loadTasks();
      
      return created;
    } catch (error) {
      console.error('Lỗi khi thêm task:', error);
      throw error;
    }
  };

  // Cập nhật task
  const updateTask = async (taskId, updates) => {
    if (!user) return;

    try {
      await updateTaskAPI(taskId, updates);
      await loadTasks();
    } catch (error) {
      console.error('Lỗi khi cập nhật task:', error);
      if (error.message === 'UNAUTHORIZED') {
        navigate('/login');
      }
      throw error;
    }
  };

  // Xóa task
  const deleteTask = async (taskId) => {
    if (!user) return;

    try {
      await deleteTaskAPI(taskId);
      await loadTasks();
    } catch (error) {
      console.error('Lỗi khi xóa task:', error);
      if (error.message === 'UNAUTHORIZED') {
        navigate('/login');
      }
      throw error;
    }
  };

  // Toggle hoàn thành task (chuyển status)
  const toggleTaskComplete = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Chuyển đổi status: TODO <-> DONE
    const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
    
    await updateTask(taskId, { status: newStatus });
  };

  const value = {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    loadTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};