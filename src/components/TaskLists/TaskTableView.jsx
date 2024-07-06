import PropTypes from "prop-types";
import { Progress } from "antd";
import Tooltip from "@mui/material/Tooltip";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import { HiFlag } from "react-icons/hi";
import { TbFlag3, TbForbid } from "react-icons/tb";

const TaskTableView = ({
  taskLists,
  handleTaskListClick,
  handleChange,
  setIsAddTaskList,
}) => {
  const headerOfTable = [
    "Name",
    "Color",
    "Progress",
    "Done",
    "Created",
    "Priority",
    "Owner",
  ];

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "urgent":
        return <HiFlag className="text-red-800" />;
      case "high":
        return <HiFlag className="text-amber-500" />;
      case "medium":
        return <HiFlag className="text-sky-600" />;
      case "low":
        return <HiFlag className="text-gray-500" />;
      default:
        return <TbFlag3 />;
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });

  const formatDateToolTip = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${formattedDate} at ${formattedTime}`;
  };

  return (
    <table className="min-w-full bg-white table-auto">
      <thead>
        <tr className="border-b">
          {headerOfTable.map((header) => (
            <th key={header} className="py-2 text-center text-sm">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {taskLists.map((taskList) => (
          <tr
            key={taskList._id}
            className="cursor-pointer hover:bg-gray-100 border-b"
          >
            <td
              className="py-2 text-center w-96 hover:text-blue-500"
              onClick={() => handleTaskListClick(taskList._id)}
            >
              {taskList.name}
            </td>
            <td className="py-2 text-center">
              <Dropdown>
                <Tooltip title="Set Color" placement="top">
                  <MenuButton
                    className="w-28"
                    style={{ backgroundColor: taskList.color }}
                  >
                    <p className="text-white">-</p>
                  </MenuButton>
                </Tooltip>
                <Menu className="w-28 !p-0">
                  <MenuItem
                    onClick={() =>
                      handleChange(taskList._id, "color", "#FFFFFF")
                    }
                    style={{
                      backgroundColor: "#FFFFFF",
                      height: "20px",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p className="text-center">-</p>
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleChange(taskList._id, "color", "#D33D44")
                    }
                    style={{
                      backgroundColor: "#D33D44",
                      height: "20px",
                      width: "100%",
                    }}
                  ></MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleChange(taskList._id, "color", "#F8AE00")
                    }
                    style={{
                      backgroundColor: "#F8AE00",
                      height: "20px",
                      width: "100%",
                    }}
                  ></MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleChange(taskList._id, "color", "#008844")
                    }
                    style={{
                      backgroundColor: "#008844",
                      height: "20px",
                      width: "100%",
                    }}
                  ></MenuItem>
                </Menu>
              </Dropdown>
            </td>
            <td className="py-2 text-center grid grid-cols-3">
              <Tooltip
                title={`${(
                  (taskList.completedTasks / taskList.todolist.length || 0) *
                  100
                ).toFixed(1)}% completed`}
                placement="top"
              >
                <Progress
                  percent={
                    (taskList.completedTasks / taskList.todolist.length || 0) *
                    100
                  }
                  showInfo={false}
                  size={[120, 7]}
                  className="w-full col-span-2"
                />
              </Tooltip>
              <div className="flex text-sm">
                {taskList.completedTasks} / {taskList.todolist.length}
              </div>
            </td>
            <td className="py-2 text-center">{taskList.completedTasks}</td>
            <td className="py-2 text-center">
              <Tooltip
                title={<span>{formatDateToolTip(taskList.createdAt)}</span>}
                placement="top"
              >
                <span>{formatDate(taskList.createdAt)}</span>
              </Tooltip>
            </td>
            <td className="py-2 text-center flex justify-center items-center">
              <Dropdown>
                <Tooltip title="Set Priority" placement="top">
                  <MenuButton className="w-28 !grid grid-cols-3 justify-center">
                    {getPriorityIcon(taskList.priority)}
                    <div className="col-span-2 flex justify-start items-start">
                      {taskList.priority}
                    </div>
                  </MenuButton>
                </Tooltip>
                <Menu className="w-28">
                  <MenuItem
                    onClick={() =>
                      handleChange(taskList._id, "priority", "urgent")
                    }
                  >
                    <HiFlag className="text-red-800" />
                    Urgent
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleChange(taskList._id, "priority", "high")
                    }
                  >
                    <HiFlag className="text-amber-500" />
                    High
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleChange(taskList._id, "priority", "medium")
                    }
                  >
                    <HiFlag className="text-sky-600" />
                    Medium
                  </MenuItem>
                  <MenuItem
                    onClick={() =>
                      handleChange(taskList._id, "priority", "low")
                    }
                    className="flex items-center"
                  >
                    <HiFlag className="text-gray-500" />
                    Low
                  </MenuItem>
                  <MenuItem
                    onClick={() => handleChange(taskList._id, "priority", "")}
                  >
                    <TbForbid />
                    Clear
                  </MenuItem>
                </Menu>
              </Dropdown>
            </td>
            <td className="py-2 text-center">{taskList.owner}</td>
          </tr>
        ))}
        <tr>
          <td
            colSpan={headerOfTable.length}
            className="py-2 text-center cursor-pointer hover:bg-gray-100"
          >
            <button
              onClick={() => setIsAddTaskList(true)}
              className="text-sm p-2 ml-2 flex items-center justify-center text-slate-400 border-2 border-transparent hover:border-slate-400 bg-white rounded-md transition-colors duration-300"
            >
              + New List
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

TaskTableView.propTypes = {
  taskLists: PropTypes.array.isRequired,
  handleTaskListClick: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  setIsAddTaskList: PropTypes.func.isRequired,
};

export default TaskTableView;
