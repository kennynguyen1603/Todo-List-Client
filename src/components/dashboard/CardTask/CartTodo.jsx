import PropTypes from "prop-types";
import { useState, useCallback, useContext, memo } from "react";
import { Tag } from "antd";
import { format, parseISO } from "date-fns";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import ItemTaskMenu from "./ItemTaskMenu";
import { AuthContext } from "@context/AuthContext";
import EditTaskModal from "../Forms/EditTaskModal";
import { deleteTaskById, updateTaskById } from "@server/todo";
import api from "@config/axios";
import AvatarGroup from "@components/common/AvatarGroup";
import Tooltips from "@components/common/Tooltips";
import ProgressBar from "@/components/ui/ProgressBar";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 550,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const CartTodo = ({
  task,
  index,
  id,
  title,
  due_date,
  processValue,
  priority,
  creator,
  members = [],
  setTasksUser,
}) => {
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  const responsiveText = "phone:text-xs tablet:text-sm desktop:text-base";

  const {
    tasksUser,
    setFilteredTasksUser,
    setTasksDates,
    setSelectedDateTasks,
    setTaskLists,
  } = useContext(AuthContext);

  const [editingTask, setEditingTask] = useState(null);

  const formatDate = useCallback((dateString) => {
    const parsedDate = parseISO(dateString);
    return format(parsedDate, "MM/dd/yyyy");
  }, []);

  const handleEditTask = useCallback(
    (task) => {
      setEditingTask(task);
      handleOpen();
    },
    [handleOpen]
  );

  const handleUpdateTask = useCallback(
    async (updatedTask) => {
      try {
        const updated = await updateTaskById(updatedTask._id, {
          ...updatedTask,
          team_id: updatedTask.team_id._id,
        });

        if (updated.success) {
          const updatedTaskData = updated.data;

          // Cập nhật các state chỉ khi task có liên quan
          setTasksUser((prevTasksUser) => {
            const isTaskInUserList = prevTasksUser.some(
              (task) => task._id === updatedTaskData._id
            );
            if (isTaskInUserList) {
              return prevTasksUser.map((task) =>
                task._id === updatedTaskData._id ? updatedTaskData : task
              );
            }
            return prevTasksUser;
          });

          setFilteredTasksUser((prevFilteredTasksUser) => {
            const isTaskInFilteredList = prevFilteredTasksUser.some(
              (task) => task._id === updatedTaskData._id
            );
            if (isTaskInFilteredList) {
              return prevFilteredTasksUser.map((task) =>
                task._id === updatedTaskData._id ? updatedTaskData : task
              );
            }
            return prevFilteredTasksUser;
          });

          setTasksDates((prevTasksDates) => {
            const isTaskInDateList = prevTasksDates.some(
              (task) => task._id === updatedTaskData._id
            );
            if (isTaskInDateList) {
              return prevTasksDates.map((task) =>
                task._id === updatedTaskData._id ? updatedTaskData : task
              );
            }
            return prevTasksDates;
          });

          setSelectedDateTasks((prevSelectedDateTasks) => {
            const isTaskInSelectedDateList = prevSelectedDateTasks.some(
              (task) => task._id === updatedTaskData._id
            );
            if (isTaskInSelectedDateList) {
              return prevSelectedDateTasks.map((task) =>
                task._id === updatedTaskData._id ? updatedTaskData : task
              );
            }
            return prevSelectedDateTasks;
          });

          // Cập nhật danh sách task mới
          const response = await api.get("/todoList/user");
          const updatedTaskLists = response.data.data;
          setTaskLists(updatedTaskLists);

          setEditingTask(null);
          alert("Todo updated successfully");
          handleClose();
        } else {
          throw new Error(updated.message);
        }
      } catch (error) {
        console.error("Failed to update todo:", error);
        alert("Failed to update todo");
        if (error.response && error.response.status === 401) {
          console.log("Session expired. Logging out...");
        } else {
          setError("Failed to update task. Please try again.");
        }
      }
    },
    [
      setTasksUser,
      setFilteredTasksUser,
      setTasksDates,
      setSelectedDateTasks,
      setTaskLists,
      handleClose,
    ]
  );

  const handleDelete = useCallback(async () => {
    try {
      await deleteTaskById(id);
      setTasksUser((prevTasks) => prevTasks.filter((task) => task._id !== id));
      setFilteredTasksUser((prevTasks) =>
        prevTasks.filter((task) => task._id !== id)
      );
      setTasksDates((prevTasks) => prevTasks.filter((task) => task._id !== id));
      setSelectedDateTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== id)
      );
      alert("Delete task successfully!");
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task");
    }
  }, [
    id,
    setTasksUser,
    setFilteredTasksUser,
    setTasksDates,
    setSelectedDateTasks,
  ]);

  return (
    <div
      key={id}
      className="task-item laptop:max-w-[370px] desktop:max-w-[450px] laptop:h-[190x]"
    >
      <Tooltips title="Priority">
        {priority === "Urgent" ? (
          <div className="priority">
            <Tag color="magenta">Urgent</Tag>
          </div>
        ) : priority === "High" ? (
          <div className="priority">
            <Tag color="red">High</Tag>
          </div>
        ) : priority === "Medium" ? (
          <div className="priority">
            <Tag color="warning">Medium</Tag>
          </div>
        ) : (
          <div className="priority">
            <Tag color="green">Low</Tag>
          </div>
        )}
      </Tooltips>

      <div className={responsiveText}>
        <Tooltips title={`${title}`}>
          {index % 3 === 0 ? (
            <h3 className="title title1">{title}</h3>
          ) : index % 3 === 1 ? (
            <h3 className="title title2">{title}</h3>
          ) : (
            <h3 className="title title3">{title}</h3>
          )}
        </Tooltips>
      </div>

      <div className="flex ml-1">
        <Tooltips title="Due date">
          <p className={`due_date ${responsiveText} text-[#b5b5b5]`}>
            {formatDate(due_date)}
          </p>
        </Tooltips>
      </div>

      <div className="ml-1">
        <div className="flex">
          <p className="text-[#b5b5b5]">Task Creator: </p>
          <p className="ml-2 text-rose-600">{creator.username}</p>
        </div>
      </div>

      <div className="mt-3 flex justify-end">
        <Tooltips title="Members">
          <AvatarGroup
            avatars={members.map((member) => member.avatarUrl)}
            size={10}
          />
        </Tooltips>
      </div>

      <div className="mt-3">
        <Tooltips title={`${processValue}%`}>
          <ProgressBar processValue={processValue} />
        </Tooltips>
      </div>

      <ItemTaskMenu
        onEdit={() => handleEditTask(task)}
        onDelete={handleDelete}
        onOpen={handleOpen}
      />
      {editingTask && (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <EditTaskModal
              task={editingTask}
              initialMembers={members}
              onSave={handleUpdateTask}
              onCancel={() => setEditingTask(null)}
            />
          </Box>
        </Modal>
      )}
    </div>
  );
};

CartTodo.propTypes = {
  task: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  due_date: PropTypes.string.isRequired,
  processValue: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  priority: PropTypes.string.isRequired,
  creator: PropTypes.object.isRequired,
  members: PropTypes.array.isRequired,
  setTasksUser: PropTypes.func.isRequired,
};

const MemoizedCartTodo = memo(CartTodo);
export default MemoizedCartTodo;
