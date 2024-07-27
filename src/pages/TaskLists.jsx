import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, useCallback, useRef } from "react";
import { AuthContext } from "@context/AuthContext";
import api from "@config/axios";
import { IoMdClose } from "react-icons/io";
import { FiLoader } from "react-icons/fi";
import { getTaskById } from "@server/todo";
import { AiOutlineTable } from "react-icons/ai";
import { PiListLight } from "react-icons/pi";
import TaskTableView from "@components/tasklists/TaskTableView";
import TaskListView from "@components/tasklists/TaskListView";
import "@styles/viewlist/viewlist.css";
const TaskLists = () => {
  const { taskLists, setTaskLists, tasksUser } = useContext(AuthContext);
  const [isAddTaskList, setIsAddTaskList] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState("table");
  const navigate = useNavigate();

  // Ref để lưu trữ dữ liệu trước đó của tasksUser
  const prevTasksUserRef = useRef(tasksUser);

  const handleTaskListClick = (id) => navigate(`/Tasklist/${id}`);

  const handleSetNameChange = (e) => setName(e.target.value);

  const validateForm = () => name.length > 0;

  const handleChange = useCallback(
    async (taskListId, field, value) => {
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
    },
    [setTaskLists]
  );

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

  const calculateCompletedTasks = useCallback(async (taskList) => {
    const completedTasks = await Promise.all(
      taskList.todolist.map(async (taskId) => {
        const task = await getTaskById(taskId);
        return task && task.status === "Completed" ? 1 : 0;
      })
    );
    return completedTasks.reduce((acc, curr) => acc + curr, 0);
  }, []);

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
  }, [taskLists, setTaskLists, calculateCompletedTasks]);

  useEffect(() => {
    if (
      JSON.stringify(tasksUser) !== JSON.stringify(prevTasksUserRef.current)
    ) {
      fetchCompletedTasks();
      prevTasksUserRef.current = tasksUser;
    }
  }, [tasksUser, fetchCompletedTasks]);

  return (
    <div className="container mx-auto px-2 py-4">
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
          <TaskTableView
            taskLists={taskLists}
            handleTaskListClick={handleTaskListClick}
            handleChange={handleChange}
            setIsAddTaskList={setIsAddTaskList}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 custom-scrollbar max-h-[80vh]">
            {taskLists.map((taskList) => (
              <div key={taskList._id} className="relative mt-5">
                <TaskListView
                  key={taskList._id}
                  id={taskList._id}
                  taskList={taskList}
                />
              </div>
            ))}
          </div>
        )}
        {isAddTaskList && (
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
                <div className="absolute bottom-5 right-6 flex items-center">
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
        )}
      </div>
    </div>
  );
};

export default TaskLists;
