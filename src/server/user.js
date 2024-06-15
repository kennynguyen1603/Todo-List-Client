import api from "../config/axios";

const getAllUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data.data;
  } catch (error) {
    console.error("Failed to get all users:", error);
    throw error;
  }
};

const addTeamToUser = async (userId, teamId) => {
  try {
    const response = await api.post(`/users/${userId}/teams`, teamId);
    return response.data.data;
  } catch (error) {
    console.error("Failed to add team to user:", error);
    throw error;
  }
};

// const removeTeamFromUser = async (userId, teamId) => {
//   try {
//     const response = await api.delete(`/users/${userId}/teams/${teamId}`);
//     return response.data.data;
//   } catch (error) {
//     console.error("Failed to remove team from user:", error);
//     throw error;
//   }
// };

const getUserById = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get user by id:", error);
    throw error;
  }
};
export { getAllUsers, addTeamToUser, getUserById };
