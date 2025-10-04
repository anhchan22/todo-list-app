import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  //Đăng nhập
  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userSession = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
      setUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      return { success: true };
    } else {
      return { success: false, message: 'Sai email hoặc mật khẩu' };
    }
  };

  //Đăng ký
  const register = (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    //check email đã tồn tại chưa
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, message: 'Email đã được đăng ký' };
    }
    
    //tạo user mới
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return { success: true, message: 'Đăng ký thành công! Vui lòng đăng nhập.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
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