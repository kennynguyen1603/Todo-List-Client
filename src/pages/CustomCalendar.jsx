import { useState, useContext } from "react";
import { getMonthDays, getWeekDays } from "@utils/calendar";
import { AuthContext } from "../context/AuthContext";
import ButtonAddTodo from "@components/common/ButtonAddTodo";

const CustomCalendar = () => {
  const { tasksUser } = useContext(AuthContext) || {};
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthDays = getMonthDays(year, month);
  const weekDays = getWeekDays();

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
      return (
        <div
          key={day}
          className={`border p-2 ${
            day.getMonth() !== month ? "bg-gray-200" : ""
          }`}
        >
          <div className="text-right">{day.getDate()}</div>
          <ul className="list-none p-0 m-0">
            {listData.map((item, index) => (
              <li key={index} className="flex items-center">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    item.type === "success"
                      ? "bg-green-500"
                      : item.type === "warning"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                />
                <span className="ml-2">{item.content}</span>
              </li>
            ))}
          </ul>
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
    <div className="w-full max-w-4xl mx-auto p-4">
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
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <div key={day} className="text-center font-semibold">
            {day}
          </div>
        ))}
        {renderCells()}
      </div>
      <div className="absolute top-2 left-0 hover:bg-blue-100 font-bold text-xl">
        <ButtonAddTodo />
      </div>
    </div>
  );
};

export default CustomCalendar;
