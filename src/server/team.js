import api from "../config/axios";

const createTeam = async (teamData) => {
  try {
    const response = await api.post("/teams", teamData);
    return response.data.data;
  } catch (error) {
    console.error("Failed to create team:", error);
    throw error;
  }
};

const updateTeam = async (teamId, teamData) => {
  try {
    const response = await api.put(`/teams/${teamId}`, teamData);
    return response.data.data;
  } catch (error) {
    console.error("Failed to update team:", error);
    throw error;
  }
};

const deleteTeam = async (teamId) => {
  try {
    const response = await api.delete(`/teams/${teamId}`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to delete team:", error);
    throw error;
  }
};

const removeTeamFromUsers = async (teamId) => {
  try {
    const response = await api.delete(`/teams/${teamId}/remove-from-users`);
    alert(response.data.message);
  } catch (error) {
    console.error("Failed to remove team from users:", error);
    alert("Failed to remove team from users");
  }
};

// const getTeamCreatedByUserId = async ()

export { createTeam, updateTeam, deleteTeam, removeTeamFromUsers };
