import { useState, useEffect, useContext, useCallback, useRef } from "react";
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
import PropTypes from "prop-types";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
const TaskListView = ({ id, taskList }) => {
  const [list, setList] = useState({ name: "" });
  const [tasksOfList, setTasksOfList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDraggingDisabled, setIsDraggingDisabled] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const { tasksUser, taskLists, setTaskLists } = useContext(AuthContext) || {};

  const prevTasksUserRef = useRef(tasksUser);
  const isFirstRender = useRef(true);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await api.get(`/todoList/${id}/todos`);
      const listTasksId = response.data.data.todolist;
      setList(response.data.data);
      const fetchedTasks = await Promise.all(listTasksId.map(getTaskById));
      setTasksOfList(fetchedTasks);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isFirstRender.current) {
      fetchTasks();
      isFirstRender.current = false;
    } else if (
      JSON.stringify(tasksUser) !== JSON.stringify(prevTasksUserRef.current)
    ) {
      fetchTasks();
      prevTasksUserRef.current = tasksUser;
    }
  }, [tasksUser, fetchTasks]);

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
    setSelectedTasks((prevSelectedTasks) =>
      prevSelectedTasks.includes(taskId)
        ? prevSelectedTasks.filter((id) => id !== taskId)
        : [...prevSelectedTasks, taskId]
    );
  };

  const handleBulkAction = async (field, value) => {
    const updates = { [field]: value };

    try {
      await Promise.all(
        selectedTasks.map((taskId) => updateTaskById(taskId, updates))
      );
      const updatedTasks = tasksOfList.map((task) =>
        selectedTasks.includes(task._id) ? { ...task, ...updates } : task
      );
      setTasksOfList(updatedTasks);
    } catch (error) {
      console.error("Failed to perform bulk action:", error);
    }
  };

  const handleDueDateChange = async (date) => {
    const formattedDate = date ? date.format("YYYY-MM-DD") : null;
    await handleBulkAction("due_date", formattedDate);
  };

  const handleRemoveFromList = async () => {
    try {
      await Promise.all(
        selectedTasks.map((taskId) =>
          api.delete(`/todoList/${id}/todos/${taskId}`)
        )
      );

      const updatedTasks = tasksOfList.filter(
        (task) => !selectedTasks.includes(task._id)
      );
      setTasksOfList(updatedTasks);

      const updatedTaskLists = taskLists.map((taskList) =>
        taskList._id === id
          ? {
              ...taskList,
              todolist: taskList.todolist.filter(
                (taskId) => !selectedTasks.includes(taskId)
              ),
              completedTasks: taskList.completedTasks - selectedTasks.length,
            }
          : taskList
      );

      setTaskLists(updatedTaskLists);
      setSelectedTasks([]);
    } catch (error) {
      console.error("Failed to remove tasks from list:", error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await Promise.all(selectedTasks.map((taskId) => deleteTask(taskId)));
      const updatedTasks = tasksOfList.filter(
        (task) => !selectedTasks.includes(task._id)
      );

      const updatedTaskLists = taskLists.map((taskList) =>
        taskList._id === id
          ? {
              ...taskList,
              todolist: taskList.todolist.filter(
                (taskId) => !selectedTasks.includes(taskId)
              ),
              completedTasks: taskList.completedTasks - selectedTasks.length,
            }
          : taskList
      );

      setTaskLists(updatedTaskLists);
      setTasksOfList(updatedTasks);
      setSelectedTasks([]);
    } catch (error) {
      console.error("Failed to delete tasks:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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

  const getStatusIcon = (status) =>
    status === "Completed" ? (
      <IoCheckmarkCircleSharp />
    ) : (
      <MdOutlineRadioButtonChecked />
    );

  return (
    <div
      className="container relative border rounded-md px-4 py-2"
      style={{
        borderLeft:
          taskList.color === "#FFFFFF" ? "" : `4px solid ${taskList.color}`,
      }}
    >
      <div className="mb-4 h-10 flex justify-center">
        {selectedTasks.length > 0 ? (
          <Navigation
            onBulkAction={handleBulkAction}
            onRemoveFromList={handleRemoveFromList}
            onDeleteTask={handleDeleteTask}
            onDueDateChange={handleDueDateChange}
            selectedTasks={selectedTasks}
            setTasksOfList={setTasksOfList}
            slideDown={true}
          />
        ) : (
          <h1 className="text-2xl font-bold">
            {list.name} - Task List Details
          </h1>
        )}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap justify-center">
          {statuses.map(
            (status) =>
              tasksByStatus[status] && (
                <div
                  key={status}
                  className="mb-4 flex-grow text-sm font-medium uppercase mt-2"
                >
                  <div
                    className="flex items-center justify-center gap-2 text-white w-[130px] p-1 rounded-md mb-2"
                    style={{
                      backgroundColor:
                        status === "Completed"
                          ? "#1F7A1F"
                          : status === "In Progress"
                          ? "#0B6BBB"
                          : "#636B74",
                    }}
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

TaskListView.propTypes = {
  id: PropTypes.string.isRequired,
  taskList: PropTypes.object.isRequired,
};

export default TaskListView;
