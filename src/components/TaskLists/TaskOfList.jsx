import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import { TbFlag3 } from "react-icons/tb";
import { HiFlag } from "react-icons/hi";
import Dropdown from "@mui/joy/Dropdown";
import MenuItem from "@mui/joy/MenuItem";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import { updateTaskById } from "../../server/todo";
import { Slider } from "antd";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../config/axios";
import { getUserById } from "../../server/user";
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import Checkbox from "@mui/material/Checkbox";
const TaskOfList = ({
  task,
  list,
  index,
  provided,
  snapshot,
  setIsDraggingDisabled,
  onTaskSelect,
  isSelected,
}) => {
  const {
    tasksUser,
    setTasksUser,
    setFilteredTasksUser,
    setTasksDates,
    setSelectedDateTasks,
    setTaskLists,
  } = useContext(AuthContext);

  const [members, setMembers] = useState([]);
  const [creator, setCreator] = useState({});

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const memberIds = await getMemberByTaskId(task._id);
        const memberPromises = memberIds.map((memberId) =>
          getUserById(memberId)
        );
        const members = await Promise.all(memberPromises);
        setMembers(members);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };
    const getCreatorByTaskId = async (taskId) => {
      try {
        const response = await api.get(`/todos/${taskId}`);
        setCreator(response.data.data.creatorId);
      } catch (error) {
        console.error("Failed to get creator by task id:", error);
        throw error;
      }
    };
    fetchMembers();
    getCreatorByTaskId(task._id);
  }, [task._id, tasksUser]);

  const getMemberByTaskId = async (taskId) => {
    try {
      const response = await api.get(`/todos/${taskId}/members`);
      return response.data.data.team_id.members;
    } catch (error) {
      console.error("Failed to get members by task id:", error);
      throw error;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "Urgent":
        return <HiFlag className="text-red-800" />;
      case "High":
        return <HiFlag className="text-amber-500" />;
      case "Medium":
        return <HiFlag className="text-sky-600" />;
      case "Low":
        return <HiFlag className="text-gray-500" />;
      default:
        return <TbFlag3 />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <IoCheckmarkCircleSharp />;
      case "In Progress":
        return <MdOutlineRadioButtonChecked />;
      case "Not Started":
        return <MdOutlineRadioButtonChecked />;
      default:
        return "";
    }
  };

  const handleChange = async (taskId, field, value) => {
    try {
      const updates = { [field]: value };

      const response = await updateTaskById(taskId, updates);
      const updatedTask = response.data;

      setTasksUser((prevTasksUser) => {
        const updatedTasksUser = prevTasksUser.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
        setFilteredTasksUser(updatedTasksUser);
        setTasksDates(updatedTasksUser);
        setSelectedDateTasks(updatedTasksUser);
        return updatedTasksUser;
      });

      const responseTaskLists = await api.get("/todoList/user");

      const updatedTaskLists = responseTaskLists.data.data;

      setTaskLists((prevTaskLists) =>
        prevTaskLists.map((taskList) =>
          taskList._id === updatedTaskLists._id
            ? { ...taskList, [field]: value }
            : taskList
        )
      );
    } catch (error) {
      console.error(`Failed to update ${field}:`, error);
    }
  };

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleSliderMouseDown = (e) => {
    e.stopPropagation();
    setIsDraggingDisabled(true);
  };

  const handleSliderMouseUp = (e) => {
    e.stopPropagation();
    setIsDraggingDisabled(false);
  };

  return (
    <tr
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`p-2 border-b rounded mb-2 bg-white ${
        snapshot.isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <td className="p-2 text-center">
        <div className="flex items-center justify-start">
          <Checkbox
            checked={isSelected}
            onChange={() => onTaskSelect(task._id)}
          />
          <span>{task.title}</span>
        </div>
      </td>
      <td className="p-2 text-center relative">
        <AvatarGroup
          max={3}
          className="avatar-group absolute left-[50%] top-[50%] transform-gpu -translate-x-1/2 -translate-y-1/2"
          sx={{
            "--Avatar-size": "30px",
          }}
        >
          {members.map((member, index) => (
            <Avatar
              key={index}
              alt={member.data.name}
              src={member.data.avatarUrl || "/static/images/avatar/default.jpg"}
              className="!box-border"
            />
          ))}
        </AvatarGroup>
      </td>
      <td className="p-2 text-center">{formatDate(task.due_date)}</td>
      <td className="p-2 text-center">
        <Dropdown>
          <Tooltip title="Set Priority" placement="top">
            <MenuButton className="w-28" size="sm">
              {getPriorityIcon(task.priority)}
              <div className="flex-1 justify-start">{task.priority}</div>
            </MenuButton>
          </Tooltip>
          <Menu className="w-28">
            <MenuItem
              onClick={() => handleChange(task._id, "priority", "Urgent")}
            >
              <HiFlag className="text-red-800" />
              Urgent
            </MenuItem>
            <MenuItem
              onClick={() => handleChange(task._id, "priority", "High")}
            >
              <HiFlag className="text-amber-500" />
              High
            </MenuItem>
            <MenuItem
              onClick={() => handleChange(task._id, "priority", "Medium")}
            >
              <HiFlag className="text-sky-600" />
              Medium
            </MenuItem>
            <MenuItem
              onClick={() => handleChange(task._id, "priority", "Low")}
              className="flex items-center"
            >
              <HiFlag className="text-gray-500" />
              Low
            </MenuItem>
          </Menu>
        </Dropdown>
      </td>
      <td className="p-2 text-center">
        <Dropdown>
          <Tooltip title="Set Status" placement="top">
            {task.status === "Not Started" ? (
              <MenuButton variant="solid" size="sm">
                <div className="flex items-center gap-2">
                  {getStatusIcon(task.status)}
                  Not Started
                </div>
              </MenuButton>
            ) : task.status === "In Progress" ? (
              <MenuButton variant="solid" size="sm" color="primary">
                <div className="flex items-center gap-2 ">
                  {getStatusIcon(task.status)}
                  In Progress
                </div>
              </MenuButton>
            ) : (
              <MenuButton variant="solid" size="sm" color="success">
                <div className="flex items-center gap-2 ">
                  {getStatusIcon(task.status)}
                  Completed
                </div>
              </MenuButton>
            )}
          </Tooltip>
          <Menu>
            <MenuItem
              onClick={() => handleChange(task._id, "status", "Completed")}
            >
              <IoCheckmarkCircleSharp className="text-green-600" />
              Completed
            </MenuItem>
            <MenuItem
              onClick={() => handleChange(task._id, "status", "In Progress")}
            >
              <MdOutlineRadioButtonChecked className="text-sky-600" />
              In Progress
            </MenuItem>
            <MenuItem
              onClick={() => handleChange(task._id, "status", "Not Started")}
              className="flex items-center"
            >
              <MdOutlineRadioButtonChecked className="text-gray-500" />
              Not Started
            </MenuItem>
          </Menu>
        </Dropdown>
      </td>
      <td className="p-2 text-center">
        <div
          onMouseDown={handleSliderMouseDown}
          onMouseUp={handleSliderMouseUp}
        >
          <Slider
            defaultValue={task.processValue}
            onChange={(value) => handleChange(task._id, "processValue", value)}
          />
        </div>
      </td>
      <td className="p-2 text-center">{list.name}</td>
    </tr>
  );
};

TaskOfList.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    team_id: PropTypes.object.isRequired,
    due_date: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    processValue: PropTypes.number.isRequired,
    creatorId: PropTypes.object.isRequired,
    todolist: PropTypes.array.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  list: PropTypes.object.isRequired,
  provided: PropTypes.object.isRequired,
  snapshot: PropTypes.object.isRequired,
  setIsDraggingDisabled: PropTypes.func.isRequired,
  onTaskSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default TaskOfList;
