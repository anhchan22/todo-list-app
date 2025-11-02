import { createContext, useContext, useState, useEffect } from 'react';
import { loginAPI, getMyInfoAPI, registerAPI, logoutAPI } from '../API/authAPI';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khôi phục phiên đăng nhập từ token
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const userData = await getMyInfoAPI();
          setUser(userData);
        } catch (error) {
          console.error('Lỗi khi khôi phục phiên:', error);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  // Đăng nhập
  const login = async (username, password) => {
    try {
      const result = await loginAPI(username, password);
      const token = result.token;
      localStorage.setItem('authToken', token);

      // Lấy thông tin user từ token
      const userData = await getMyInfoAPI();
      setUser(userData);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message || 'Không thể kết nối đến server' };
    }
  };

  // Đăng ký
  const register = async (username, email, password) => {
    try {
      await registerAPI(username, email, password);
      return { success: true, message: 'Đăng ký thành công! Vui lòng đăng nhập.' };
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      return { success: false, message: error.message || 'Không thể kết nối đến server' };
    }
  };

  // Đăng xuất
  const logout = async () => {
    try {
      await logoutAPI();
    } catch (error) {
      console.error('Lỗi đăng xuất:', error);
    }
    
    setUser(null);
    localStorage.removeItem('authToken');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};