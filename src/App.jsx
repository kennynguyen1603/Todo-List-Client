import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutMain from "./layouts/LayoutMain";
import NotFound from "./pages/NotFound";
import LayoutAuth from "./layouts/LayoutAuth";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashBoard from "./pages/DashBoard";
import TaskLists from "./pages/TaskLists";
import Profile from "./pages/Profile";
import Team from "./pages/Team";
import CustomCalendar from "./pages/CustomCalendar";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import TaskListDetail from "../src/components/TaskList/TaskListDetail";
import TaskDetail from "./pages/TaskDetail";

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<LayoutAuth />}>
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
          </Route>
          <Route element={<LayoutMain />}>
            <Route path="/" element={<DashBoard />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/calendar" element={<CustomCalendar />} />
            <Route path="/taskLists" element={<TaskLists />} />
            <Route path="/taskList/:id" element={<TaskListDetail />} />
            <Route path="/task/:id/taskdetail" element={<TaskDetail />} />
            <Route path="/team" element={<Team />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
