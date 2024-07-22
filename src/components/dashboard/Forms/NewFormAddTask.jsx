import { useState, useEffect, useContext, useCallback } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "@config/axios";
import { createTask } from "@server/todo";
import { createTeam, updateTeam } from "@server/team";
import { addTeamToUser } from "@server/user";
import { AuthContext } from "@context/AuthContext";
import { debounce } from "lodash";
import { io } from "socket.io-client";

const socket = io(
  import.meta.env.REACT_APP_SOCKET_URL || "http://localhost:8080"
);

const FormAddTask = () => {
  const {
    setTasksUser,
    setSelectedDateTasks,
    setTasksDates,
    setFilteredTasksUser,
    setTaskLists,
  } = useContext(AuthContext) || {};

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Not Started",
    due_date: "",
    priority: "Medium",
    lists: [], // List ID of selected lists
  });

  const [teamMembers, setTeamMembers] = useState([]); // List of members
  const [selectedEmails, setSelectedEmails] = useState([]); // Selected emails

  const [errors, setErrors] = useState({});
  const [lists, setLists] = useState([]); // List of available lists
  const [showDescription, setShowDescription] = useState(false);
  const [emailSearch, setEmailSearch] = useState(""); // Email search field

  const user = localStorage.getItem("user"); // Get user from localStorage
  const userId = user ? JSON.parse(user).userId : null;

  useEffect(() => {
    console.log("🚀 ~ FormAddTask ~ selectedEmails:", selectedEmails);
  }, [selectedEmails]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        // lấy danh sách các list mà người này đã tạo
        const response = await api.get("/todoList/user");
        setLists(response.data.data);
      } catch (error) {
        console.error("Failed to fetch lists:", error);
      }
    };
    fetchLists();
  }, []);

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

  const handleEmailSearchChange = (e) => {
    const email = e.target.value;
    setEmailSearch(email);
    debouncedSearch(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
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

  const handleListChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "lists" ? e.target.value : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.due_date) newErrors.due_date = "Due Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const memberIds = await Promise.all(
        selectedEmails.map(async (email) => {
          const response = await api.get(`/users/search?email=${email}`);
          const member = response.data.data.find(
            (user) => user.email === email
          );
          return member ? member._id : null;
        })
      ).then((ids) => ids.filter((id) => id !== null));

      if (!memberIds.includes(userId)) {
        memberIds.push(userId);
        selectedEmails.push({
          _id: userId,
          username: JSON.parse(localStorage.getItem("user")).username,
          type: "user",
        });
      }

      const teamData = {
        name: `${formData.title} Team`,
        members: memberIds,
        creatorId: userId,
      };

      // Create a new team
      const createdTeam = await createTeam(teamData);

      const taskData = {
        ...formData,
        // assignTo: selectedEmails,
        team_id: createdTeam._id,
        creatorId: userId,
        todolist: formData.lists || [],
      };

      const newTask = await createTask(taskData);

      await updateTeam(createdTeam._id, { todo: newTask.data._id });

      if (formData.lists.length > 0) {
        await Promise.all(
          formData.lists.map((listId) =>
            api.put(`/todoList/${listId}`, {
              $push: { todolist: newTask.data._id },
            })
          )
        );
      }

      const response = await api.get("/todoList/user");
      const updatedTaskLists = response.data.data;

      setTaskLists(updatedTaskLists);

      await Promise.all(
        memberIds.map(async (userId) => {
          await addTeamToUser(userId, { teamId: createdTeam._id });
        })
      );

      setTasksUser((prevTasks) => [newTask.data, ...prevTasks]);
      setFilteredTasksUser((prevTasks) => [newTask.data, ...prevTasks]);
      setTasksDates((prevTasks) => [newTask.data, ...prevTasks]);
      setSelectedDateTasks((prevTasks) => [newTask.data, ...prevTasks]);

      // Gửi lời mời qua Socket.IO
      selectedEmails.forEach((member) => {
        console.log(
          "🚀 ~ selectedEmails.forEach ~ selectedEmails:",
          selectedEmails
        );
        // socket.emit("sendInvitation", {
        //   email: member,
        //   teamId: createdTeam._id,
        //   taskId: newTask.data._id,
        // });
        if (member._id !== userId) {
          socket.emit("sendInvitation", {
            teamId: createdTeam._id,
            teamName: teamData.name,
            taskId: newTask.data._id,
          });
        }
      });

      alert("Task added successfully!");
      setFormData({
        title: "",
        description: "",
        status: "Not Started",
        due_date: "",
        priority: "Medium",
        list: "",
      });
      setSelectedEmails([]);
    } catch (error) {
      console.error("Failed to add task:", error);
      alert("Failed to add task.");
    }
  };

  return (
    <div className="max-h-[85vh] overflow-y-auto p-4 relative">
      <div className="flex justify-center mb-4">
        <h1 className="text-xl font-bold text-emerald-500 uppercase">
          Add Task
        </h1>
      </div>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        className="flex flex-col w-full mx-auto pb-16 custom-scrollbar"
      >
        <TextField
          required
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.title}
          helperText={errors.title}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={showDescription}
              onChange={(e) => setShowDescription(e.target.checked)}
              name="showDescription"
            />
          }
          label="Add description"
        />
        {showDescription && (
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            margin="normal"
            error={!!errors.description}
            helperText={errors.description}
          />
        )}
        <TextField
          select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {["Not Started", "In Progress", "Completed"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          type="date"
          label="Due Date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
          error={!!errors.due_date}
          helperText={errors.due_date}
        />
        <TextField
          select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {["Low", "Medium", "High", "Urgent"].map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>

        <FormControl fullWidth margin="normal">
          <InputLabel id="select-list-label">Select Lists</InputLabel>
          <Select
            labelId="select-list-label"
            id="select-list"
            name="lists"
            multiple
            value={formData.lists || []}
            onChange={handleListChange}
            fullWidth
          >
            {lists.map((list) => (
              <MenuItem key={list._id} value={list._id}>
                {list.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Assign to"
          value={emailSearch}
          onChange={handleEmailSearchChange}
          fullWidth
          margin="normal"
        />
        {teamMembers.length > 0 && (
          <List>
            {teamMembers.map((member) => (
              <ListItem
                key={member._id}
                button
                onClick={() => handleSelectEmail(member.email)}
              >
                <ListItemText primary={member.email} />
              </ListItem>
            ))}
          </List>
        )}
        <List>
          {selectedEmails.map((email) => (
            <ListItem key={email}>
              <ListItemText primary={String(email)} />
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteEmail(email)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          className="h-12"
        >
          Add Task
        </Button>
      </Box>
    </div>
  );
};

export default FormAddTask;
