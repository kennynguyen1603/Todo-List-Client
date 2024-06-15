import axios from "axios";
// import Cookies from "js-cookie";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_TODO_URL || "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để thêm token vào mọi request
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     const signature = Cookies.get("signature");

//     if (token && signature) {
//       config.headers["Authorization"] = `Bearer ${token}.${signature}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

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
