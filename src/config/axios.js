import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_TODO_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to update the Authorization token
export function updateAuthorization(accessToken) {
  if (accessToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    console.log("Authorization header set");
  } else {
    delete api.defaults.headers.common["Authorization"];
    console.log("Authorization header removed");
  }
}

export default api;
