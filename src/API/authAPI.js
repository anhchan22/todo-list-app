import { http } from './http.js';

// Đăng nhập
export const loginAPI = async (username, password) => {
  console.log('Logging in with username:', username);
  
  try {
    const result = await http("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    
    const token = result?.token;
    if (!token) throw new Error("No token in response");
    
    console.log('Token received:', token);
    localStorage.setItem("authToken", token);
    
    return { token };
  } catch (error) {
    console.error('Login API Error:', error);
    throw error;
  }
};

// Lấy thông tin user
export const getMyInfoAPI = async () => {
  const result = await http("/api/auth/myInfo", {
    method: "GET"
  });
  
  console.log('User info:', result);
  return result;
};

// Đăng ký
export const registerAPI = async (username, email, password) => {
  const result = await http("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password })
  });
  
  return result;
};

// Đăng xuất
export const logoutAPI = async () => {
  try {
    await http("/api/auth/logout", {
      method: "POST"
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
  
  localStorage.removeItem("authToken");
};
