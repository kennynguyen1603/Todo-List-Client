import { useState, useEffect, useContext, useCallback } from "react";
import { IoMdSearch } from "react-icons/io";
import { AuthContext } from "../../context/AuthContext";
import {
  getTasks,
  getTasksToday,
  getTasksRecently,
  getTasksUpcoming,
  getTasksLater,
} from "../../server/todo";
import TaskList from "./TaskList";
import { debounce } from "lodash";

const TaskOverView = () => {
  const [active, setActive] = useState("Recently"); // Recently, Today, Upcoming, Later

  const { authState, filteredTasksUser, setFilteredTasksUser, tasksUser } =
    useContext(AuthContext) || {};

  const { user, isAuthenticated } = authState || {};

  const [todayTaskCount, setTodayTaskCount] = useState(0); // State để lưu số lượng task của ngày hôm nay

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    dueDate: "",
  });

  // lấy số lượng task của ngày hôm nay
  useEffect(() => {
    if (isAuthenticated && user && user._id) {
      getTasksToday({ search }).then((tasks) => {
        setTodayTaskCount(tasks.length);
      });
    }
  }, [user, isAuthenticated, search]);

  useEffect(() => {
    const fetchFilteredTasks = async () => {
      if (isAuthenticated && user && user._id) {
        try {
          let tasks;
          const filterParams = { ...filters, search };

          if (active === "Today") {
            tasks = await getTasksToday(filterParams);
          } else if (active === "Recently") {
            tasks = await getTasksRecently(filterParams);
          } else if (active === "Upcoming") {
            tasks = await getTasksUpcoming(filterParams);
          } else if (active === "Later") {
            tasks = await getTasksLater(filterParams);
          } else {
            tasks = await getTasks(filterParams);
          }

          setFilteredTasksUser(tasks);
        } catch (error) {
          console.error("Failed to fetch tasks:", error);
        }
      } else {
        setFilteredTasksUser([]);
      }
    };

    fetchFilteredTasks();
  }, [
    user,
    isAuthenticated,
    active,
    search,
    filters,
    setFilteredTasksUser,
    tasksUser,
  ]);

  function handleToggle(newActive) {
    setActive(newActive);
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // const debouncedSearch = useCallback(
  //   debounce((value) => setSearch(value), 300),
  //   []
  // );

  // const debouncedFilterChange = useCallback(
  //   debounce((name, value) => {
  //     setFilters((prevFilters) => ({
  //       ...prevFilters,
  //       [name]: value,
  //     }));
  //   }, 300),
  //   []
  // );

  // const handleSearchChange = (e) => {
  //   debouncedSearch(e.target.value);
  // };

  // const handleFilterChange = (e) => {
  //   const { name, value } = e.target;
  //   debouncedFilterChange(name, value);
  // };

  return (
    <div className="taskOverview">
      <div className="taskSummary flex flex-col gap-3">
        <p className="text-2xl italic">Hello, {user?.username}!</p>
        <p className="text-2xl font-semibold">
          {todayTaskCount > 0
            ? `You have got ${todayTaskCount} tasks today!`
            : "You have no tasks today!"}
        </p>
        <div className="searchBar mt-2">
          <IoMdSearch className="text-2xl font-semibold ml-1" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search tasks..."
          />
        </div>
      </div>
      <div className="taskDetail">
        <p className="text-2xl font-semibold mb-2">My Tasks</p>
        <div className="tasksToggle">
          <button
            className={`toggle-btn ${
              active === "Recently" ? "active-btn" : ""
            }`}
            onClick={() => handleToggle("Recently")}
          >
            Recently
          </button>
          <button
            className={`toggle-btn ${active === "Today" ? "active-btn" : ""}`}
            onClick={() => handleToggle("Today")}
          >
            Today
          </button>
          <button
            className={`toggle-btn ${
              active === "Upcoming" ? "active-btn" : ""
            }`}
            onClick={() => handleToggle("Upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`toggle-btn ${active === "Later" ? "active-btn" : ""}`}
            onClick={() => handleToggle("Later")}
          >
            Later
          </button>
        </div>
        <div className="filters flex flex-wrap justify-evenly mt-2">
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
          <input
            type="date"
            name="dueDate"
            value={filters.dueDate}
            onChange={handleFilterChange}
          />
        </div>
        <div className="taskListOverview">
          <TaskList taskList={filteredTasksUser} />
        </div>
      </div>
    </div>
  );
};

export default TaskOverView;
