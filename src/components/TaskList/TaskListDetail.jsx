import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../config/axios";
import {
  getTaskById,
  updateTask,
  updateTaskById,
  deleteTask,
} from "../../server/todo";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { AuthContext } from "../../context/AuthContext";
import TaskOfList from "./TaskOfList";
import Navigation from "./Navigation";
import "../../styles/viewlist/viewlist.css";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { MdOutlineRadioButtonChecked } from "react-icons/md";

const TaskListDetail = () => {
  const { id } = useParams();
  const { tasksUser, setTaskLists } = useContext(AuthContext) || {};
  const [list, setList] = useState({ name: "" });
  const [tasksOfList, setTasksOfList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDraggingDisabled, setIsDraggingDisabled] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get(`/todoList/${id}/todos`);
        setList(data.data);
        const fetchedTasks = await Promise.all(
          data.data.todolist.map(getTaskById)
        );
        setTasksOfList(fetchedTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [id, tasksUser]);

  const onDragEnd = async (result) => {
    if (!result.destination || isDraggingDisabled) return;

    const newTasksOfList = [...tasksOfList];
    const [movedTask] = newTasksOfList.splice(result.source.index, 1);
    movedTask.status = result.destination.droppableId;
    newTasksOfList.splice(result.destination.index, 0, movedTask);

    setTasksOfList(newTasksOfList);
    try {
      await updateTask(movedTask._id, { status: movedTask.status });
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleTaskSelect = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleBulkAction = async (field, value) => {
    try {
      const updates = { [field]: value };
      await Promise.all(
        selectedTasks.map((taskId) => updateTaskById(taskId, updates))
      );
      setTasksOfList((prev) =>
        prev.map((task) =>
          selectedTasks.includes(task._id) ? { ...task, ...updates } : task
        )
      );
    } catch (error) {
      console.error("Failed to perform bulk action:", error);
    }
  };

  const handleDueDateChange = (date) =>
    handleBulkAction("due_date", date ? date.format("YYYY-MM-DD") : null);

  const handleRemoveFromList = async () => {
    try {
      await Promise.all(
        selectedTasks.map((taskId) =>
          api.delete(`/todoList/${id}/todos/${taskId}`)
        )
      );
      setTasksOfList((prev) =>
        prev.filter((task) => !selectedTasks.includes(task._id))
      );
      setTaskLists((prev) =>
        prev.map((taskList) =>
          taskList._id === id
            ? {
                ...taskList,
                todolist: taskList.todolist.filter(
                  (taskId) => !selectedTasks.includes(taskId)
                ),
                completedTasks: taskList.completedTasks - selectedTasks.length,
              }
            : taskList
        )
      );
      setSelectedTasks([]);
    } catch (error) {
      console.error("Failed to remove tasks from list:", error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await Promise.all(selectedTasks.map(deleteTask));
      setTasksOfList((prev) =>
        prev.filter((task) => !selectedTasks.includes(task._id))
      );
      setTaskLists((prev) =>
        prev.map((taskList) =>
          taskList._id === id
            ? {
                ...taskList,
                todolist: taskList.todolist.filter(
                  (taskId) => !selectedTasks.includes(taskId)
                ),
                completedTasks: taskList.completedTasks - selectedTasks.length,
              }
            : taskList
        )
      );
      setSelectedTasks([]);
    } catch (error) {
      console.error("Failed to delete tasks:", error);
    }
  };

  const getStatusIcon = (status) =>
    status === "Completed" ? (
      <IoCheckmarkCircleSharp />
    ) : (
      <MdOutlineRadioButtonChecked />
    );

  if (loading) return <div>Loading...</div>;

  const tasksByStatus = tasksOfList.reduce((acc, task) => {
    acc[task.status] = acc[task.status] || [];
    acc[task.status].push(task);
    return acc;
  }, {});

  const statuses = ["Completed", "In Progress", "Not Started"];
  const headerOfTable = [
    "Name",
    "Assignee",
    "Due Date",
    "Priority",
    "Status",
    "Progress",
    "Lists",
  ];

  return (
    <div className="container mx-auto p-2">
      <div className="mb-4 h-10 flex justify-center relative">
        <Navigation
          onBulkAction={handleBulkAction}
          onRemoveFromList={handleRemoveFromList}
          onDeleteTask={handleDeleteTask}
          onDueDateChange={handleDueDateChange}
          selectedTasks={selectedTasks}
          setTasksOfList={setTasksOfList}
          slideDown={selectedTasks.length > 0}
        />
        <h1
          className={`text-2xl font-bold absolute top-2 transition-transform ease-in-out delay-300 ${
            selectedTasks.length ? "translate-y-[-200px]" : "translate-y-0"
          }`}
        >
          {list.name}
        </h1>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap justify-center overflow-y-auto max-h-[80vh]">
          {statuses.map(
            (status) =>
              tasksByStatus[status] && (
                <div
                  key={status}
                  className="mb-4 flex-grow text-sm font-medium uppercase mt-2"
                >
                  <div
                    className={`flex items-center justify-center gap-2 bg-${
                      status === "Completed"
                        ? "[#1F7A1F]"
                        : status === "In Progress"
                        ? "[#0B6BBB]"
                        : "[#636B74]"
                    } text-white w-[130px] p-1 rounded-md mb-2`}
                  >
                    {getStatusIcon(status)}
                    {status}
                  </div>

                  <table className="min-w-full bg-white table-auto mb-2">
                    <thead>
                      <tr className="border-b">
                        {headerOfTable.map((header) => (
                          <th
                            key={header}
                            className="py-2 px-4 text-center text-sm"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <Droppable droppableId={status}>
                      {(provided) => (
                        <tbody
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="bg-gray-100 px-2 pt-2 pb-1 rounded-md"
                        >
                          {tasksByStatus[status].map((task, index) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id}
                              index={index}
                              isDragDisabled={isDraggingDisabled}
                            >
                              {(provided, snapshot) => (
                                <TaskOfList
                                  key={task._id}
                                  task={task}
                                  list={list}
                                  index={index}
                                  provided={provided}
                                  snapshot={snapshot}
                                  setIsDraggingDisabled={setIsDraggingDisabled}
                                  onTaskSelect={handleTaskSelect}
                                  isSelected={selectedTasks.includes(task._id)}
                                />
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </tbody>
                      )}
                    </Droppable>
                  </table>
                </div>
              )
          )}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TaskListDetail;
