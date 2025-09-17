import { useAuth } from '../context/AuthContext';
import { LogOut, User, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Calendar from '../components/Calendar';
import toast from 'react-hot-toast';

const CalendarPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="calendar-page">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="user-info">
            <User className="user-icon" />
            <div>
              <h1>Calendar View</h1>
              <p>View your tasks in calendar format</p>
            </div>
          </div>
          <div className="header-actions">
            <Link to="/dashboard" className="back-btn">
              <ArrowLeft size={20} />
              Back to Dashboard
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="calendar-main">
        <Calendar />
      </main>
    </div>
  );
};

export default CalendarPage;