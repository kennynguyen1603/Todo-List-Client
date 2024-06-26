import { useEffect, useState, useCallback } from "react";
import { Progress, Tag } from "antd";
import { format, parseISO } from "date-fns";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import { getUserById } from "../../../server/user";
import ItemTaskMenu from "./ItemTaskMenu";
import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import EditTaskModal from "./EditTaskModal";
import {
  deleteTaskById,
  getMemberByTaskId,
  updateTaskById,
} from "../../../server/todo";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import api from "../../../config/axios";
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
  description,
  due_date,
  processValue,
  priority,
  setTasksUser,
}) => {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
    return format(parsedDate, "dd/MM/yyyy");
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const memberIds = await getMemberByTaskId(id);
        const memberPromises = memberIds.map((memberId) =>
          getUserById(memberId)
        );
        const members = await Promise.all(memberPromises);
        setMembers(members);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };
    fetchMembers();
  }, [id, tasksUser]);

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const updated = await updateTaskById(updatedTask._id, updatedTask);

      if (updated.success) {
        const updatedTasks = tasksUser.map((task) =>
          task._id === updated.data._id ? updated.data : task
        );

        const response = await api.get("/todoList/user");
        const updatedTaskLists = response.data.data;

        setTaskLists(updatedTaskLists);

        setTasksUser(updatedTasks);
        setFilteredTasksUser(updatedTasks);
        setTasksDates(updatedTasks);
        setSelectedDateTasks(updatedTasks);

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
  };

  const handleDelete = async () => {
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
  };

  return (
    <div key={id} className="task-item">
      <Tooltip title="Priority">
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
      </Tooltip>
      <Tooltip title="Title">
        <div className="">
          {index % 3 === 0 ? (
            <h3 className="title title1">{title}</h3>
          ) : index % 3 === 1 ? (
            <h3 className="title title2">{title}</h3>
          ) : (
            <h3 className="title title3">{title}</h3>
          )}
        </div>
      </Tooltip>
      <div className="flex flex-col gap-1 ml-2">
        <Tooltip title="Description">
          <p className="description">{description}</p>
        </Tooltip>
        <Tooltip title="Due date">
          <p className="due_date">{formatDate(due_date)}</p>
        </Tooltip>
      </div>
      <Tooltip title="Members" placement="right">
        <AvatarGroup max={4} className="avatar-group">
          {members.map((member, index) => (
            <Avatar
              key={index}
              alt={member.data.name}
              src={member.data.avatarUrl || "/static/images/avatar/default.jpg"}
              className="avatar"
            />
          ))}
        </AvatarGroup>
      </Tooltip>
      <Tooltip title="Process">
        <Progress percent={processValue} status="active" />
      </Tooltip>
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
  setTasksUser: PropTypes.func.isRequired,
};

export default CartTodo;
