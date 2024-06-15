import { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { GrStatusDisabled } from "react-icons/gr";
import { MdOutlinePlaylistRemove, MdDeleteOutline } from "react-icons/md";
import { TbFlag3 } from "react-icons/tb";
import { BsCalendar4Event } from "react-icons/bs";
import Tooltip from "@mui/material/Tooltip";
import Dropdown from "@mui/joy/Dropdown";
import MenuItem from "@mui/joy/MenuItem";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import { HiFlag } from "react-icons/hi";
import { IoCheckmarkCircleSharp } from "react-icons/io5";
import { MdOutlineRadioButtonChecked } from "react-icons/md";
import debounce from "lodash.debounce";
import api from "../../config/axios"; // Assuming you have an axios instance configured
import { DatePicker, Popover } from "antd";
import { updateTeam } from "../../server/team";
import { getTaskById } from "../../server/todo";

const Navigation = ({
  onBulkAction,
  onRemoveFromList,
  onDeleteTask,
  onDueDateChange,
  selectedTasks,
  setTasksOfList,
}) => {
  const [selectedEmails, setSelectedEmails] = useState([]); // Selected emails
  const [emailSearch, setEmailSearch] = useState(""); // Email search field
  const [teamMembers, setTeamMembers] = useState([]); // Team members list
  console.log("🚀 ~ teamMembers:", teamMembers);

  // tìm email
  const debouncedSearch = useCallback(
    debounce(async (email) => {
      if (email.length >= 7) {
        try {
          const response = await api.get(`/users/search?email=${email}`);
          setTeamMembers(response.data.data);
        } catch (error) {
          console.error("Không thể tìm kiếm người dùng:", error);
          setTeamMembers([]);
        }
      } else {
        setTeamMembers([]);
      }
    }, 500),
    []
  );

  useEffect(() => {
    const updateTeamMembers = async () => {
      try {
        const promises = selectedTasks.map(async (taskId) => {
          const task = await getTaskById(taskId);
          return updateTeam(task.team_id._id, { teamMembers: selectedEmails });
        });
        await Promise.all(promises);

        // lấy user từ email
        const memberIds = teamMembers.map((member) => member._id);
        console.log("🚀 ~ updateTeamMembers ~ memberIds:", memberIds);

        setTasksOfList((prevTasks) =>
          prevTasks.map((task) => {
            return {
              ...task,
              team_id: {
                ...task.team_id,
                members: memberIds,
              },
            };
          })
        );
      } catch (error) {
        console.error("Không thể cập nhật thành viên nhóm:", error);
      }
    };

    if (selectedEmails.length > 0 && selectedTasks.length > 0) {
      updateTeamMembers();
    }
    // cập nhập lại giao diện
  }, [selectedEmails, selectedTasks, setTasksOfList, teamMembers]);

  const handleEmailSearchChange = (e) => {
    const email = e.target.value;
    setEmailSearch(email);
    debouncedSearch(email);
  };

  const handleSelectEmail = (email) => {
    if (!selectedEmails.includes(email)) {
      setSelectedEmails([...selectedEmails, email]);
      setEmailSearch("");
      setTeamMembers([]);
    }
  };

  const handleDeleteEmail = (email) => {
    setSelectedEmails(selectedEmails.filter((e) => e !== email));
  };

  const onChange = (date, dateString) => {
    onDueDateChange(date, dateString);
  };

  return (
    <div className="w-3/5 flex items-center justify-evenly gap-2 text-lg text-center bg-[#5ACCBB] text-white rounded-full ">
      <Dropdown>
        <Tooltip title="Set assignees">
          <MenuButton>
            <AiOutlineUsergroupAdd />
          </MenuButton>
        </Tooltip>
        <Menu className="w-96">
          <div className="p-2">
            <input
              type="text"
              placeholder="Search by email"
              value={emailSearch}
              onChange={handleEmailSearchChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
            {teamMembers.length > 0 && (
              <div className="mt-2 max-h-40 overflow-y-auto">
                {teamMembers.map((user) => (
                  <MenuItem
                    key={user._id}
                    onClick={() => handleSelectEmail(user.email)}
                  >
                    {user.email}
                  </MenuItem>
                ))}
              </div>
            )}
            {selectedEmails.length > 0 && (
              <div className="mt-2">
                {selectedEmails.map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between p-1 border rounded"
                  >
                    <span>{email}</span>
                    <button
                      onClick={() => handleDeleteEmail(email)}
                      className="text-red-500"
                    >
                      <MdDeleteOutline />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Menu>
      </Dropdown>

      <Dropdown>
        <Tooltip title="Set priority" placement="top">
          <MenuButton>
            <TbFlag3 />
          </MenuButton>
        </Tooltip>
        <Menu className="w-28">
          <MenuItem onClick={() => onBulkAction("priority", "Urgent")}>
            <HiFlag className="text-red-800" />
            Urgent
          </MenuItem>
          <MenuItem onClick={() => onBulkAction("priority", "High")}>
            <HiFlag className="text-amber-500" />
            High
          </MenuItem>
          <MenuItem onClick={() => onBulkAction("priority", "Medium")}>
            <HiFlag className="text-sky-600" />
            Medium
          </MenuItem>
          <MenuItem onClick={() => onBulkAction("priority", "Low")}>
            <HiFlag className="text-gray-500" />
            Low
          </MenuItem>
        </Menu>
      </Dropdown>

      <Dropdown>
        <Tooltip title="Remove tasks from this List" placement="top">
          <MenuButton>
            <MdOutlinePlaylistRemove />
          </MenuButton>
        </Tooltip>
        <Menu>
          <MenuItem onClick={() => onRemoveFromList()}>
            Remove from List
          </MenuItem>
          <MenuItem>Send Notifications</MenuItem>
        </Menu>
      </Dropdown>

      <Dropdown>
        <Tooltip title="Set Status" placement="top">
          <MenuButton>
            <GrStatusDisabled />
          </MenuButton>
        </Tooltip>
        <Menu>
          <MenuItem onClick={() => onBulkAction("status", "Completed")}>
            <IoCheckmarkCircleSharp className="text-green-600" />
            Completed
          </MenuItem>
          <MenuItem onClick={() => onBulkAction("status", "In Progress")}>
            <MdOutlineRadioButtonChecked className="text-sky-600" />
            In Progress
          </MenuItem>
          <MenuItem onClick={() => onBulkAction("status", "Not Started")}>
            <MdOutlineRadioButtonChecked className="text-gray-500" />
            Not Started
          </MenuItem>
        </Menu>
      </Dropdown>

      <Popover content={<DatePicker onChange={onChange} />} trigger="click">
        <Tooltip title="Set due date" placement="top">
          <button className="flex w-12 justify-center items-center border border-gray-300 h-[90%] px-3 py-1 text-slate-600 hover:bg-white font-thin rounded-md">
            <BsCalendar4Event />
          </button>
        </Tooltip>
      </Popover>

      <Tooltip title="Delete" placement="top">
        <button
          className="flex w-12 justify-center items-center border border-gray-300 h-[90%] px-3 py-1 text-slate-600 hover:bg-white font-thin rounded-md"
          onClick={() => onDeleteTask()}
        >
          <MdDeleteOutline />
        </button>
      </Tooltip>
    </div>
  );
};

Navigation.propTypes = {
  onBulkAction: PropTypes.func.isRequired,
  onRemoveFromList: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onDueDateChange: PropTypes.func.isRequired,
  selectedTasks: PropTypes.array.isRequired,
  setTasksOfList: PropTypes.func.isRequired,
};

export default Navigation;
