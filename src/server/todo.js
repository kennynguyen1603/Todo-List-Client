import api from "../config/axios";

const getTaskById = async (id) => {
  try {
    const response = await api.get(`/todos/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get task by id:", error);
    throw error;
  }
};

const getTasks = async (filters) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/todos/search?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get tasks:", error);
    throw error;
  }
};

// lấy todo cá nhân và todo thuộc 1 team có tham gia
const getTodosByUserId = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/todos`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get tasks:", error);
    throw error;
  }
};

const createTask = async (task) => {
  try {
    const response = await api.post("/todos", task);
    return response.data;
  } catch (error) {
    console.error("Failed to create task:", error);
    throw error;
  }
};

const updateTask = async (id, task) => {
  try {
    const response = await api.put(`/todos/${id}`, task);
    return response.data;
  } catch (error) {
    console.error(`Failed to update task with id ${id}:`, error);
    throw error;
  }
};

const deleteTask = async (id) => {
  try {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to delete task with id ${id}:`, error);
    throw error;
  }
};

const getMemberByTaskId = async (taskId) => {
  try {
    const response = await api.get(`/todos/${taskId}/members`);
    return response.data.data.team_id.members;
  } catch (error) {
    console.error("Failed to get members by task id:", error);
    throw error;
  }
};

const getTasksToday = async (filters) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/todos/today?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get tasks today:", error);
    throw error;
  }
};

const getTasksUpcoming = async (filters) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/todos/upcoming?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get upcoming tasks:", error);
    throw error;
  }
};

const getTasksRecently = async (filters) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/todos/recently?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get recently tasks:", error);
    throw error;
  }
};

const getTasksLater = async (filters) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/todos/later?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to get later tasks:", error);
    throw error;
  }
};

const getTasksByDate = async (date) => {
  try {
    const response = await api.get("/todos/by-date", {
      params: { date },
    });
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch tasks by date:", error);
    return [];
  }
};

const updateTaskById = async (id, updatedData) => {
  try {
    const response = await api.put(`/todos/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Failed to update task:", error);
    throw error;
  }
};

const deleteTaskById = async (id) => {
  try {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete task:", error);
    throw error;
  }
};

export {
  getTaskById,
  getTasks,
  getTodosByUserId,
  createTask,
  updateTask,
  deleteTask,
  getMemberByTaskId,
  getTasksToday,
  getTasksUpcoming,
  getTasksRecently,
  getTasksLater,
  getTasksByDate,
  updateTaskById,
  deleteTaskById,
};
