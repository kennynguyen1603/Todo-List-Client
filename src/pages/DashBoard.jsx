// import { useEffect, useState } from "react";
import TaskOverView from "../components/dashboard/TaskOverView/TaskOverView";
import TodaysSchedule from "../components/dashboard/TodaysSchedule/TodaysSchedule";
const DashBoard = () => {
  return (
    <div className="dashboard ">
      <TaskOverView />
      <TodaysSchedule />
    </div>
  );
};

export default DashBoard;
