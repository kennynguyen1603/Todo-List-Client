import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = ({ onDateSelect, taskDates }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate());
  });

  useEffect(() => {
    const adjustedDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      )
    );
    const date = adjustedDate.toISOString().split("T")[0];
    onDateSelect(date);
  }, [onDateSelect, selectedDate]);

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const currentWeekday = currentDate.getDay();

  const startOfWeek = currentDay - currentWeekday;

  const days = Array.from({ length: 14 }).map((_, i) => {
    let day = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      startOfWeek + i
    );
    return {
      dayOfWeek: daysOfWeek[day.getDay()],
      date: day.getDate(),
      month: day.getMonth(),
      year: day.getFullYear(),
      isActive:
        day.getDate() === currentDay &&
        day.getMonth() === currentMonth &&
        day.getFullYear() === currentYear,
      hasTasks: taskDates.includes(
        new Date(Date.UTC(day.getFullYear(), day.getMonth(), day.getDate()))
          .toISOString()
          .split("T")[0]
      ),
    };
  });

  const handleDateClick = (day) => {
    const selected = new Date(Date.UTC(day.year, day.month, day.date));
    setSelectedDate(selected);
  };

  return (
    <div className="calendar">
      <div className="week-names">
        {daysOfWeek.map((dayName, index) => (
          <div
            key={index}
            className={`day-name ${
              index === currentDate.getDay() ? "active" : ""
            }`}
          >
            {dayName}
          </div>
        ))}
      </div>
      <div className="week-dates">
        {days.slice(0, 7).map((day, index) => (
          <button
            key={index}
            className={`day-date ${day.isActive ? "active" : ""} ${
              day.date === selectedDate.getUTCDate() &&
              day.month === selectedDate.getUTCMonth() &&
              day.year === selectedDate.getUTCFullYear()
                ? "selected"
                : ""
            }`}
            onClick={() => handleDateClick(day)}
          >
            {day.date}
            {day.hasTasks && (
              <span className="task-icon absolute top-[-5px]">📅</span>
            )}
          </button>
        ))}
      </div>
      <div className="next-week-dates">
        {days.slice(7, 14).map((day, index) => (
          <button
            key={index}
            className={`day-date ${day.isActive ? "active" : ""} ${
              day.date === selectedDate.getUTCDate() &&
              day.month === selectedDate.getUTCMonth() &&
              day.year === selectedDate.getUTCFullYear()
                ? "selected"
                : ""
            }`}
            onClick={() => handleDateClick(day)}
          >
            {day.date}
            {day.hasTasks && (
              <span className="task-icon absolute top-[-5px]">📅</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

Calendar.propTypes = {
  onDateSelect: PropTypes.func.isRequired,
  taskDates: PropTypes.arrayOf(PropTypes.string),
};

export default Calendar;
