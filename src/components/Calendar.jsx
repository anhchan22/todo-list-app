import { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday } from 'date-fns';

const Calendar = () => {
  const { tasks } = useTask();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.deadline) return false;
      return isSameDay(new Date(task.deadline), date);
    });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="calendar-nav">
          <button onClick={() => navigateMonth(-1)} className="nav-btn">
            <ChevronLeft size={20} />
          </button>
          <h2>{format(currentDate, 'MMMM yyyy')}</h2>
          <button onClick={() => navigateMonth(1)} className="nav-btn">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="days-grid">
          {monthDays.map(day => {
            const dayTasks = getTasksForDate(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentDay = isToday(day);

            return (
              <div
                key={day.toISOString()}
                onClick={() => handleDateClick(day)}
                className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${
                  isSelected ? 'selected' : ''
                } ${isCurrentDay ? 'today' : ''} ${dayTasks.length > 0 ? 'has-tasks' : ''}`}
              >
                <span className="day-number">{format(day, 'd')}</span>
                {dayTasks.length > 0 && (
                  <div className="task-indicators">
                    {dayTasks.slice(0, 3).map((task, index) => (
                      <div
                        key={task.id}
                        className={`task-dot priority-${task.priority} ${task.completed ? 'completed' : ''}`}
                        title={task.title}
                      />
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="task-count">+{dayTasks.length - 3}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="selected-date-tasks">
        <h3>
          <CalendarIcon size={20} />
          Tasks for {format(selectedDate, 'MMMM dd, yyyy')}
        </h3>
        {selectedDateTasks.length > 0 ? (
          <div className="date-task-list">
            {selectedDateTasks.map(task => (
              <div key={task.id} className={`date-task-item ${task.completed ? 'completed' : ''}`}>
                <div className="task-info">
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  <div className="task-badges">
                    <span className={`priority-badge priority-${task.priority}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    {task.completed && (
                      <span className="status-badge completed">Completed</span>
                    )}
                  </div>
                </div>
                <div className="task-time">
                  {format(new Date(task.deadline), 'HH:mm')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-tasks">No tasks scheduled for this date</p>
        )}
      </div>
    </div>
  );
};

export default Calendar;