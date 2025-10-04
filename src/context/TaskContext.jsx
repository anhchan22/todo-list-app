import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  //Lấy từ AuthContext để biết user nào đang đăng nhập
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTasks();
    } else {
      setTasks([]);
    }
  }, [user]);

  const loadTasks = () => {
    if (!user) return;
    
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const userTasks = allTasks.filter(task => task.userId === user.id);
    setTasks(userTasks);
  };

  const saveTasks = (updatedTasks) => {
    if (!user) return;
    
    const allTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const otherUserTasks = allTasks.filter(task => task.userId !== user.id);
    const newAllTasks = [...otherUserTasks, ...updatedTasks];
    
    localStorage.setItem('tasks', JSON.stringify(newAllTasks));
    setTasks(updatedTasks);
  };

  const addTask = (title, description = '', deadline = '') => {
    const newTask = {
      id: Date.now().toString(),
      userId: user.id,
      title,
      description,
      deadline: deadline || null,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    return newTask;
  };

  const updateTask = (taskId, updates) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    saveTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
  };

  const toggleTaskComplete = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask(taskId, { completed: !task.completed });
    }
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};