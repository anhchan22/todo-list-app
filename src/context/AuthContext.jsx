import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Check if user exists in localStorage users array
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const existingUser = users.find(
      u => u.email === userData.email && u.password === userData.password
    );
    
    if (existingUser) {
      const userToSave = { ...existingUser };
      delete userToSave.password; // Don't save password in current user session
      setUser(userToSave);
      localStorage.setItem('user', JSON.stringify(userToSave));
      return { success: true };
    } else {
      return { success: false, message: 'Invalid email or password' };
    }
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      return { success: false, message: 'User already exists with this email' };
    }
    
    // Add new user
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login after registration
    const userToSave = { ...newUser };
    delete userToSave.password;
    setUser(userToSave);
    localStorage.setItem('user', JSON.stringify(userToSave));
    
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};