import { createContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api, { updateAuthorization } from "@config/axios";
import { getTodosByUserId } from "@server/todo";
import { Alert } from "antd";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import CircularProgress from "@mui/material/CircularProgress";
import { io } from "socket.io-client";

const AuthContext = createContext();
const socket = io(import.meta.env.VITE_API_BASE_URL || "http://localhost:8080");
const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [authState, setAuthState] = useState({
    accessToken: localStorage.getItem("accessToken"),
    user: JSON.parse(localStorage.getItem("user")),
    isAuthenticated: !!localStorage.getItem("accessToken"),
  });

  // todayschedule
  const [tasksUser, setTasksUser] = useState([]);

  // taskoverview
  const [filteredTasksUser, setFilteredTasksUser] = useState([]);

  // task by date
  const [tasksDates, setTasksDates] = useState([]);
  const [selectedDateTasks, setSelectedDateTasks] = useState([]);

  // list task
  const [taskLists, setTaskLists] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const [invitations, setInvitations] = useState([]); // List of invitations

  useEffect(() => {
    const initializeAuthState = () => {
      const token = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user"));
      if (token && user) {
        updateAuthorization(token);
        setAuthState({
          accessToken: token,
          user: user,
          isAuthenticated: true,
        });
        socket.emit("initialize", user.userId);
      } else {
        setAuthState({
          accessToken: null,
          user: null,
          isAuthenticated: false,
        });
      }
    };

    initializeAuthState();
  }, []);

  useEffect(() => {
    socket.on("allInvitations", (allInvitations) => {
      setInvitations(allInvitations);
    });

    socket.on("updateInvitations", (updateInvitations) => {
      setInvitations(updateInvitations);
    });

    socket.on("newInvitation", (data) => {
      const { teamId, email } = data;
      alert(`You have a new invitation from ${email} to join team ${teamId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socket.off("allInvitations");
      socket.off("updateInvitations");
      socket.off("newInvitation");
      socket.off("disconnect");
    };
  }, []);

  const checkTokenExpiration = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decoded = jwtDecode(token);
      const isTokenExpired = Date.now() >= decoded.exp * 1000;
      if (isTokenExpired) {
        refreshToken();
      }
    }
  }, []);

  const refreshToken = async () => {
    try {
      const response = await api.post("/auth/refresh");
      const { accessToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      updateAuthorization(accessToken);
      setAuthState((prevState) => ({
        ...prevState,
        accessToken,
        isAuthenticated: true,
      }));
    } catch (error) {
      console.error("Failed to refresh token:", error);
      logout();
    }
  };

  const fetchUserInfo = useCallback(async () => {
    try {
      const response = await api.get(`/users/${authState.user?.userId}`);
      setAuthState((prevState) => ({
        ...prevState,
        user: response.data.data,
      }));
    } catch (error) {
      console.error("Failed to fetch user info:", error);
      if (error.response && error.response.status === 401) {
        refreshToken();
      } else {
        setError("Unable to fetch user details. Please try again later.");
      }
    }
  }, [authState.user?.userId]);

  const fetchTasks = useCallback(async () => {
    if (authState.user?.userId) {
      try {
        const tasks = await getTodosByUserId(authState.user.userId);
        setTasksUser(tasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    }
  }, [authState.user]);

  const fetchTaskListByUserId = useCallback(async () => {
    if (authState.user?.userId) {
      try {
        const response = await api.get(`/todoList/user`);
        setTaskLists(response.data.data);
      } catch (error) {
        console.error("Failed to fetch task list by user:", error);
      }
    }
  }, [authState.user]);

  useEffect(() => {
    checkTokenExpiration();
  }, [checkTokenExpiration]);

  useEffect(() => {
    if (authState.isAuthenticated && authState.user?.userId) {
      fetchUserInfo();
      fetchTasks();
      fetchTaskListByUserId();
    }
  }, [
    authState.isAuthenticated,
    authState.user?.userId,
    fetchUserInfo,
    fetchTasks,
    fetchTaskListByUserId,
  ]);

  useEffect(() => {
    if (!authState.accessToken && !authState.user) {
      setAuthState({ accessToken: null, user: null, isAuthenticated: false });
    }
  }, [authState.accessToken, authState.user]);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", { username, password });
      const { user } = response.data;
      const { accessToken } = response.data.token;

      if (accessToken && typeof accessToken === "string") {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        updateAuthorization(accessToken);
        setAuthState({
          accessToken,
          user,
          isAuthenticated: true,
        });
        setLoginSuccess(true);
        navigate(searchParams.get("redirect") || "/dashboard");
        setTimeout(() => setLoginSuccess(false), 3000);
      } else {
        throw new Error("Invalid token format received from server");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    updateAuthorization(null);
    setAuthState({ accessToken: null, user: null, isAuthenticated: false });
    navigate("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        tasksUser,
        setTasksUser,
        filteredTasksUser,
        setFilteredTasksUser,
        tasksDates,
        setTasksDates,
        selectedDateTasks,
        setSelectedDateTasks,
        login,
        logout,
        refreshToken,
        loading,
        error,
        taskLists,
        setTaskLists,
        invitations,
        setInvitations,
      }}
    >
      {!loading ? (
        children
      ) : (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      )}
      {/* {error && <Alert severity="error">{error}</Alert>} */}
      {loginSuccess && (
        <Alert
          message="Login success"
          type="success"
          className="absolute top-0 w-full z-50 text-center"
        />
      )}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
