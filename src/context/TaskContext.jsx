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
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadTasks();
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

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      userId: user.id,
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      deadline: taskData.deadline || null,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
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
    updateTask(taskId, { completed: !tasks.find(task => task.id === taskId)?.completed });
  };

  const getTasksByPriority = (priority) => {
    return tasks.filter(task => task.priority === priority);
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => 
      task.deadline && 
      new Date(task.deadline) < now && 
      !task.completed
    );
  };

  const getUpcomingTasks = (days = 3) => {
    const now = new Date();
    const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
    
    return tasks.filter(task => 
      task.deadline && 
      new Date(task.deadline) >= now && 
      new Date(task.deadline) <= futureDate &&
      !task.completed
    );
  };

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    getTasksByPriority,
    getOverdueTasks,
    getUpcomingTasks,
    loadTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};