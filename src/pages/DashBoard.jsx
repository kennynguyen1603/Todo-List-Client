// import { useEffect, useState } from "react";
import TaskOverView from "../components/dashboard/TaskOverView";
import TodaysSchedule from "../components/dashboard/TodaysSchedule";
const DashBoard = () => {
  return (
    <div className="dashboard container mx-auto">
      <TaskOverView />
      <TodaysSchedule />
    </div>
  );
};

export default DashBoard;
