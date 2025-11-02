import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  //chuyen trang
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      const result = await login(username, password);
      
      if (result && result.success) {
        toast.success('Đăng nhập thành công!');
        navigate('/dashboard');
      } else {
        toast.error(result?.message || 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin.');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2>Todo-List</h2>
          <p>Đăng nhập vào tài khoản của bạn</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên đăng nhập của bạn"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                required
              />
            </div>
            
            <button type="submit" className="auth-btn">
              Đăng nhập
            </button>
          </form>
          
          <p className="auth-footer">
            Bạn chưa có tài khoản?{' '}
            <Link to="/register" className="auth-link">
              Đăng ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;