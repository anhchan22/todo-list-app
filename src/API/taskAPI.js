import { http } from './http.js';

// Lấy danh sách tasks
export const getMyTasksAPI = async () => {
  try {
    const result = await http("/api/tasks/myTasks?page=0&size=100", {
      method: "GET"
    });
    
    // Nếu result là array thì return trực tiếp, nếu có content thì lấy content
    return Array.isArray(result) ? result : (result?.content || []);
  } catch (error) {
    console.error('Get tasks error:', error);
    if (error.message.includes('401') || error.message.includes('403')) {
      localStorage.removeItem('authToken');
      throw new Error('UNAUTHORIZED');
    }
    throw error;
  }
};

// Thêm task mới
export const createTaskAPI = async (taskData) => {
  const { title, description, dueDate } = taskData;

  // Gửi dueDate với cả giờ (ISO format: YYYY-MM-DDTHH:mm)
  try {
    const result = await http("/api/tasks", {
      method: "POST",
      body: JSON.stringify({
        title,
        description: description || undefined,
        dueDate: dueDate || undefined,
        categoryId: 1 // default category
      })
    });
    return result;
  } catch (error) {
    console.error('Create task error:', error);
    if (error.message.includes('401') || error.message.includes('403')) {
      localStorage.removeItem('authToken');
      throw new Error('UNAUTHORIZED');
    }
    throw error;
  }
};

// Gán task cho user hiện tại
export const assignTaskAPI = async (taskId, userId) => {
  try {
    const result = await http(`/api/tasks/${taskId}/assignTask?userId=${encodeURIComponent(userId)}`, {
      method: "PATCH"
    });
    return result;
  } catch (error) {
    console.error('Assign task error:', error);
    if (error.message.includes('401') || error.message.includes('403')) {
      localStorage.removeItem('authToken');
      throw new Error('UNAUTHORIZED');
    }
    throw error;
  }
};

// Cập nhật task
export const updateTaskAPI = async (taskId, updates) => {
  try {
    const result = await http(`/api/tasks/${taskId}`, {
      method: "PUT",
      body: JSON.stringify(updates)
    });
    
    return result;
  } catch (error) {
    console.error('Update task error:', error);
    if (error.message.includes('401') || error.message.includes('403')) {
      localStorage.removeItem('authToken');
      throw new Error('UNAUTHORIZED');
    }
    throw error;
  }
};

// Xóa task
export const deleteTaskAPI = async (taskId) => {
  try {
    const result = await http(`/api/tasks/${taskId}`, {
      method: "DELETE"
    });
    return result;
  } catch (error) {
    console.error('Delete task error:', error);
    if (error.message.includes('401') || error.message.includes('403')) {
      localStorage.removeItem('authToken');
      throw new Error('UNAUTHORIZED');
    }
    throw error;
  }
};
