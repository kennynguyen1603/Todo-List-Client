import { useContext } from "react";
import { Badge, Calendar } from "antd";
import { AuthContext } from "../context/AuthContext";
import ButtonAddTodo from "../components/dashboard/ButtonAddTodo";
import "../styles/calendar/customCalendar.css";

const CustomCalendar = () => {
  const { tasksUser } = useContext(AuthContext) || {};

  const getListData = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
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

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="">
        {listData.map((item, index) => (
          <li key={index}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const monthCellRender = (value) => {
    const month = value.month();
    const num = tasksUser.filter(
      (task) => new Date(task.due_date).getMonth() === month
    ).length;
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Tasks this month</span>
      </div>
    ) : null;
  };
  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  return (
    <div className="relative">
      <div className="absolute top-2 left-0 hover:bg-[#e6f4ff] font-bold text-xl">
        <ButtonAddTodo />
      </div>
      <Calendar
        cellRender={cellRender}
        className="custom-calender bg-transparent"
      />
    </div>
  );
};

export default CustomCalendar;
