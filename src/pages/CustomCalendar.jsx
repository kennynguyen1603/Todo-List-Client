import { useState, useContext } from "react";
import { getMonthDays, getWeekDays } from "@utils/calendar";
import { AuthContext } from "../context/AuthContext";
import ButtonAddTodo from "@components/common/ButtonAddTodo";
import "@styles/calendar/customCalendar.css";
const CustomCalendar = () => {
  const { tasksUser } = useContext(AuthContext) || {};
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthDays = getMonthDays(year, month);
  const weekDays = getWeekDays();

  console.log("hello");

  const getListData = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return tasksUser
      .filter((task) => task.due_date.startsWith(dateStr))
      .map((task) => {
        if (task.status === "Completed") {
          return { content: task.title, type: "success" };
        } else if (task.status === "In Progress") {
          return { content: task.title, type: "warning" };
        } else {
          return { content: task.title, type: "error" };
        }
      });
  };

  const renderCells = () => {
    return monthDays.map((day) => {
      const listData = getListData(day);
      const isHovered = hoveredDate && hoveredDate.getTime() === day.getTime();
      return (
        <div
          key={day}
          className={`border p-2 h-40 hover:bg-slate-100 relative ${
            day.getMonth() !== month ? "bg-gray-200" : ""
          }`}
          onMouseEnter={() => setHoveredDate(day)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          <div className="text-right">{day.getDate()}</div>
          <ul className="list-none max-h-24 overflow-y-auto custom-scrollbar">
            {listData.map((item, index) => (
              <li key={index} className="flex items-center mt-2">
                <span
                  className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    item.type === "success"
                      ? "bg-green-500"
                      : item.type === "warning"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
                <span className="ml-2 text-sm flex-grow">{item.content}</span>
              </li>
            ))}
          </ul>
          {isHovered && (
            <div className="absolute bottom-1 right-1">
              <ButtonAddTodo fontsize={"text-xs"} />
            </div>
          )}
        </div>
      );
    });
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  return (
    <div className="w-full h-full mx-auto py-4 px-2 overflow-y-auto md:overflow-y-scroll custom-calendar">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          className="text-gray-600 hover:text-gray-800"
        >
          &lt;
        </button>
        <span className="text-lg font-bold">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </span>
        <button
          onClick={nextMonth}
          className="text-gray-600 hover:text-gray-800"
        >
          &gt;
        </button>
      </div>
      <div className="grid grid-cols-7">
        {weekDays.map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {renderCells()}
      </div>
    </div>
  );
};

export default CustomCalendar;
