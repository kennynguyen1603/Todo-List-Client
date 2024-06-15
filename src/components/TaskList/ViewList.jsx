import { useState, useEffect, useContext } from "react";
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

const ViewList = ({ id, taskList }) => {
  const [list, setList] = useState({ name: "" });
  const [tasksOfList, setTasksOfList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDraggingDisabled, setIsDraggingDisabled] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const { tasksUser, taskLists, setTaskLists } = useContext(AuthContext) || {};
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/todoList/${id}/todos`);
        const listTasksId = response.data.data.todolist;
        setList(response.data.data);
        const fetchedTasks = await Promise.all(
          listTasksId.map(async (taskId) => {
            const task = await getTaskById(taskId);
            return task;
          })
        );
        setTasksOfList(fetchedTasks);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
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
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const handleBulkAction = async (field, value) => {
    try {
      const updates = { [field]: value };

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
    console.log("formattedDate", formattedDate);
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

      const updatedTaskLists = taskLists.map((taskList) => {
        if (taskList._id === id) {
          return {
            ...taskList,
            todolist: taskList.todolist.filter(
              (taskId) => !selectedTasks.includes(taskId)
            ),
            completedTasks: taskList.completedTasks - selectedTasks.length,
          };
        }
        return taskList;
      });

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

      const updatedTaskLists = taskLists.map((taskList) => {
        if (taskList._id === id) {
          return {
            ...taskList,
            todolist: taskList.todolist.filter(
              (taskId) => !selectedTasks.includes(taskId)
            ),
            completedTasks: taskList.completedTasks - selectedTasks.length,
          };
        }
        return taskList;
      });

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

  return (
    <div className="container mx-auto relative">
      <div
        className={`absolute left-0 top-0 w-4 h-full bg-[${taskList.color}] z-10`}
      ></div>
      <div className="mb-4 h-10 flex justify-center transition-all ease-in-out delay-300">
        {selectedTasks.length > 0 ? (
          <Navigation
            onBulkAction={handleBulkAction}
            onRemoveFromList={handleRemoveFromList}
            onDeleteTask={handleDeleteTask}
            onDueDateChange={handleDueDateChange}
            selectedTasks={selectedTasks}
            setTasksOfList={setTasksOfList}
          />
        ) : (
          <h1 className="text-2xl font-bold">
            {list.name} - Task List Details
          </h1>
        )}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-wrap justify-center overflow-y-auto max-h-[80vh]">
          {statuses.map(
            (status) =>
              tasksByStatus[status] &&
              tasksByStatus[status].length > 0 && (
                <div key={status} className="mb-4 flex-grow">
                  <h2 className="text-xl font-bold uppercase text-center">
                    {status}
                  </h2>
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

ViewList.propTypes = {
  id: PropTypes.string.isRequired,
  taskList: PropTypes.object.isRequired,
};

export default ViewList;
