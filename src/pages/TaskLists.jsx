import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../config/axios";
import { IoMdClose } from "react-icons/io";
import { FiLoader } from "react-icons/fi";
import { getTaskById } from "../server/todo";
import { TbFlag3 } from "react-icons/tb";
import { HiFlag } from "react-icons/hi";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import { Progress } from "antd";
import Tooltip from "@mui/material/Tooltip";
import { TbForbid } from "react-icons/tb";
import { AiOutlineTable } from "react-icons/ai";
import { PiListLight } from "react-icons/pi";
// import TaskListDetail from "../components/TaskList/TaskListDetail";
import ViewList from "../components/TaskList/ViewList";
const TaskLists = () => {
  const { taskLists, setTaskLists } = useContext(AuthContext);
  console.log("🚀 ~ TaskLists ~ taskLists:", taskLists);
  const [isAddTaskList, setIsAddTaskList] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [view, setView] = useState("table"); // ("table" | "list)

  const navigate = useNavigate();

  const handleTaskListClick = (id) => {
    navigate(`/Tasklist/${id}`);
  };

  const handleSetNameChange = (e) => {
    setName(e.target.value);
  };

  const validateForm = () => {
    return name.length > 0;
  };

  const handleChange = async (taskListId, field, value) => {
    try {
      const response = await api.put(`/todoList/${taskListId}`, {
        [field]: value,
      });
      const updatedTaskList = response.data.data;
      setTaskLists((prevTaskLists) =>
        prevTaskLists.map((taskList) =>
          taskList._id === updatedTaskList._id
            ? { ...taskList, [field]: value }
            : taskList
        )
      );
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please enter a task list name.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await api.post("/todoList", { name });
      setTaskLists([...taskLists, response.data.data]);
      setName("");
      setIsAddTaskList(false);
    } catch (error) {
      console.error("Failed to add task list.", error);
      alert("Failed to add task list.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCompletedTasks = async (taskList) => {
    const completedTasks = await Promise.all(
      taskList.todolist.map(async (taskId) => {
        const task = await getTaskById(taskId);
        return task && task.status === "Completed" ? 1 : 0;
      })
    );
    return completedTasks.reduce((acc, curr) => acc + curr, 0);
  };

  const fetchCompletedTasks = useCallback(async () => {
    const updatedTaskLists = await Promise.all(
      taskLists.map(async (taskList) => {
        const completedTasks = await calculateCompletedTasks(taskList);
        return { ...taskList, completedTasks };
      })
    );

    if (JSON.stringify(updatedTaskLists) !== JSON.stringify(taskLists)) {
      setTaskLists(updatedTaskLists);
    }
  }, [taskLists, setTaskLists]);

  useEffect(() => {
    fetchCompletedTasks();
  }, [fetchCompletedTasks]);

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

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateToolTip = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const timeOptions = { hour: "2-digit", minute: "2-digit" };
    const formattedDate = date.toLocaleDateString(undefined, options);
    const formattedTime = date.toLocaleTimeString(undefined, timeOptions);
    return `${formattedDate} at ${formattedTime}`;
  };

  const headerOfTable = [
    "Name",
    "Color",
    "Progress",
    "Done",
    "Created",
    "Priority",
    "Owner",
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="relative">
        <div className="flex items-center gap-10">
          <h1 className="text-xl font-bold mb-4">Lists</h1>
          <div className="flex justify-end items-center mb-4 text-sm">
            <button
              className={`${
                view === "table"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-slate-400"
              } p-2 rounded-md mr-2`}
              onClick={() => setView("table")}
            >
              <AiOutlineTable />
            </button>
            <button
              className={`${
                view === "list"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-slate-400"
              } p-2 rounded-md`}
              onClick={() => setView("list")}
            >
              <PiListLight />
            </button>
          </div>
        </div>
        {view === "table" ? (
          <table className="min-w-full bg-white table-auto">
            <thead>
              <tr className="border-b">
                {headerOfTable.map((header) => (
                  <th
                    key={header}
                    className="py-2 text-center text-slate-400 text-sm"
                  >
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
                          style={{
                            backgroundColor: taskList.color,
                          }}
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
                        (taskList.completedTasks / taskList.todolist.length ||
                          0) * 100
                      ).toFixed(1)}% completed`}
                      placement="top"
                    >
                      <Progress
                        percent={
                          (taskList.completedTasks / taskList.todolist.length ||
                            0) * 100
                        }
                        showInfo={false}
                        size={[120, 7]}
                        className="w-full col-span-2"
                      />
                    </Tooltip>
                    <div className="flex text-sm w-full">
                      {taskList.completedTasks} / {taskList.todolist.length}
                    </div>
                  </td>

                  <td className="py-2 text-center">
                    {taskList.completedTasks}
                  </td>
                  <td className="py-2 text-center">
                    <Tooltip
                      title={
                        <span>{formatDateToolTip(taskList.createdAt)}</span>
                      }
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
                          onClick={() =>
                            handleChange(taskList._id, "priority", "")
                          }
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
                  className="py-2 text-center cursor-pointer hover:bg-gray-100 "
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
        ) : (
          <div className="grid grid-cols-1 gap-4 overflow-auto max-h-[80vh] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {taskLists.map((taskList) => (
              <div key={taskList._id} className="relative">
                <ViewList
                  key={taskList._id}
                  id={taskList._id}
                  taskList={taskList}
                />
              </div>
            ))}
          </div>
        )}
        {isAddTaskList && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50">
              <div className="bg-white w-1/3 h-1/4 rounded-md">
                <div className="text-xl p-4 flex justify-between items-center border-b-2 ">
                  <h1 className="font-semibold">Create list</h1>
                  <button
                    className="text-slate-400 p-2 hover:rotate-90 ease-in-out duration-300"
                    onClick={() => setIsAddTaskList(false)}
                  >
                    <IoMdClose />
                  </button>
                </div>
                <div className="flex flex-col px-6 py-4 relative h-[100%] bg-[#FAFBFC] rounded-md">
                  <label htmlFor="name" className="mb-2 text-sm">
                    List name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={handleSetNameChange}
                    placeholder="List"
                    className="border border-gray-300 p-2 focus:outline-none rounded-md mb-4"
                  />
                  <div className="absolute bottom-10 right-7 flex items-center">
                    {isLoading && (
                      <FiLoader className="animate-spin text-blue-500 mr-4" />
                    )}
                    <button
                      className="bg-gray-300 hover:bg-gray-500 text-white p-2 mr-2 rounded-md active:bg-gray-700"
                      onClick={() => setIsAddTaskList(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded-md active:bg-blue-900"
                      onClick={handleAddSubmit}
                      disabled={isLoading}
                    >
                      Create list
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskLists;
