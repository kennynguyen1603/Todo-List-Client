import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import PropTypes from "prop-types";
import { updateTaskById } from "../../server/todo";
import { getUserById } from "../../server/user";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../config/axios";
import { updateTeam } from "../../server/team";

const EditTaskModal = ({ task, initialMembers, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ...task,
    todolist: task.todolist || [],
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [errors, setErrors] = useState({});
  const [lists, setLists] = useState([]);
  const [emailSearch, setEmailSearch] = useState("");

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await api.get("/todoList/user");
        setLists(response.data.data);
      } catch (error) {
        console.error("Failed to fetch lists:", error);
      }
    };
    fetchLists();
  }, []);

  useEffect(() => {
    const initializeSelectedMembers = async () => {
      if (initialMembers && Array.isArray(initialMembers)) {
        const members = initialMembers.map((member) => ({
          _id: member.data._id,
          username: member.data.username,
          email: member.data.email,
        }));

        try {
          const creator = await getUserById(task.creatorId);
          const creatorInfo = {
            _id: creator.data._id,
            username: creator.data.username,
            email: creator.data.email,
          };

          const creatorExists = members.some(
            (member) => member._id === task.creatorId
          );

          if (!creatorExists) {
            members.push(creatorInfo);
          }

          setSelectedMembers(members);
          setFormData((prevData) => ({
            ...prevData,
            creator: creatorInfo,
          }));
        } catch (error) {
          console.error("Failed to fetch creator:", error);
        }
      }
    };

    initializeSelectedMembers();
  }, [initialMembers, task.creatorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleEmailSearchChange = async (e) => {
    const email = e.target.value;
    setEmailSearch(email);

    if (email.length >= 7) {
      try {
        const response = await api.get(`/users/search?email=${email}`);
        setTeamMembers(response.data.data);
      } catch (error) {
        console.error("Failed to search users:", error);
        setTeamMembers([]);
      }
    } else {
      setTeamMembers([]);
    }
  };

  const handleSelectEmail = (email) => {
    const member = teamMembers.find((m) => m.email === email);
    if (member && !selectedMembers.find((m) => m.email === email)) {
      setSelectedMembers([
        ...selectedMembers,
        { _id: member._id, username: member.username, email: member.email },
      ]);
      setEmailSearch("");
      setTeamMembers([]);
    }
  };

  const handleDeleteEmail = (email) => {
    if (email !== formData.creator.email) {
      setSelectedMembers(selectedMembers.filter((m) => m.email !== email));
    }
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

    const selectedMemberIds = selectedMembers.map((member) => member._id);
    if (!selectedMemberIds.includes(task.creatorId)) {
      selectedMemberIds.push(task.creatorId);
    }

    try {
      const updatedTeam = await updateTeam(task.team_id, {
        members: selectedMemberIds,
      });

      if (updatedTeam) {
        const updatedTask = {
          ...formData,
          todolist: formData.todolist || [],
          members: selectedMembers,
        };

        onSave(updatedTask);
        setSelectedMembers(updatedTask.members);
      } else {
        setErrors({ form: "Failed to update team members." });
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      setErrors({ form: "Failed to update task" });
    }
  };

  return (
    <div className="modal relative">
      <div className="flex justify-center relative top-[-10px]">
        <h1 className="text-xl font-bold text-emerald-500 uppercase">
          Edit Task
        </h1>
      </div>
      <div className="modal-content">
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
          className="flex flex-col w-full mx-auto gap-1 custom-scrollbar"
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

          <TextField
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.status}
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
            value={formData.due_date.split("T")[0]}
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
              name="todolist"
              multiple
              value={formData.todolist || []}
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
            {selectedMembers &&
              selectedMembers.map((member) => (
                <ListItem key={member.email}>
                  <ListItemText primary={member.email} />
                  {member.email !== formData.creator.email && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteEmail(member.email)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </ListItem>
              ))}
          </List>
          {errors.form && <div className="error-message">{errors.form}</div>}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Save
          </Button>
          <Button
            type="button"
            variant="contained"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Box>
      </div>
    </div>
  );
};

EditTaskModal.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    team_id: PropTypes.string.isRequired,
    creatorId: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        username: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
      })
    ),
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    due_date: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    todolist: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  initialMembers: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default EditTaskModal;
