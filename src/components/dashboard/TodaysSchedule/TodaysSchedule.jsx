import { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "@context/AuthContext";
import ButtonAddTodo from "../../common/ButtonAddTodo";
import TasksStatus from "./TasksStatus";
import TimeTracker from "./TimeTracker";
import Calendar from "./Calendar";
import { getTasksByDate } from "../../../server/todo";
import TaskList from "../TasksList/TaskList";
import Header from "./Header";
import "@styles/cardTask.css";

const TodaysSchedule = () => {
  const [trackingTime, setTrackingTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const {
    authState,
    tasksUser,
    tasksDates,
    setTasksDates,
    selectedDateTasks,
    setSelectedDateTasks,
  } = useContext(AuthContext) || {};
  const { user } = authState || {};

  useEffect(() => {
    const datesWithTasks = tasksUser.map((task) => {
      const date = task.due_date.split("T")[0];
      return date;
    });

    setTasksDates([...new Set(datesWithTasks)]);
  }, [setTasksDates, tasksUser]);

  const handleStartTracking = () => {
    console.log("Tracking started");
    setIsTracking(true);
  };

  const handleStopTracking = (elapsedTime) => {
    console.log("Tracking stopped, elapsed time:", elapsedTime);
    setTrackingTime(elapsedTime);
    setIsTracking(false);
  };

  const handleDateSelect = useCallback(
    async (date) => {
      const tasks = await getTasksByDate(date);
      setSelectedDateTasks(tasks);
    },
    [setSelectedDateTasks]
  );

  return (
    <div className="todaysSchedule">
      <Header user={user} />
      <TimeTracker
        onStartTracking={handleStartTracking}
        onStopTracking={handleStopTracking}
      />
      <div className="relative desktop:mt-5 laptop:mt-3 mb-5">
        <TasksStatus />
        <div className="absolute top-[-2px] right-0">
          <ButtonAddTodo fontsize={"text-sm"} />
        </div>
      </div>
      <Calendar onDateSelect={handleDateSelect} taskDates={tasksDates} />
      <div className="taskByDate">
        <TaskList taskList={selectedDateTasks} />
      </div>
    </div>
  );
};

export default TodaysSchedule;
