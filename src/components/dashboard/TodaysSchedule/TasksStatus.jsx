import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import CircularProgressBar from "@components/UI/CircularProgressBar";

const TasksStatus = () => {
  const { tasksUser } = useContext(AuthContext) || {};

  const calculateTaskStatus = (tasks) => {
    const statusCounts = {
      completed: 0,
      inProgress: 0,
      notStarted: 0,
    };
    tasks.forEach((task) => {
      if (task.status === "Completed") {
        statusCounts.completed += 1;
      } else if (task.status === "In Progress") {
        statusCounts.inProgress += 1;
      } else if (task.status === "Not Started") {
        statusCounts.notStarted += 1;
      }
    });
    const totalTasks = tasks.length;
    return [
      {
        quantity: statusCounts.completed,
        label: "Completed",
        value: totalTasks
          ? Math.round((statusCounts.completed / totalTasks) * 100)
          : 0,
        color: "#4CAF50",
      },
      {
        quantity: statusCounts.inProgress,
        label: "In Progress",
        value: totalTasks
          ? Math.round((statusCounts.inProgress / totalTasks) * 100)
          : 0,
        color: "#2196F3",
      },
      {
        quantity: statusCounts.notStarted,
        label: "Not Started",
        value: totalTasks
          ? Math.round((statusCounts.notStarted / totalTasks) * 100)
          : 0,
        color: "#F44336",
      },
    ];
  };

  const taskData = calculateTaskStatus(tasksUser || []);

  return (
    <div className="taskStatus my-2">
      <p className="text-xl font-semibold my-4">Tasks Status</p>
      <div className="flex justify-between mb-4">
        <div className="flex flex-wrap justify-around">
          {taskData.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center w-full"
              style={{ width: 100, height: 100 }}
            >
              <CircularProgressBar
                percentage={item.value}
                color={item.color}
                size={50}
              >
                {`${item.value}%`}
              </CircularProgressBar>
              <div className="flex items-center mt-2 text-sm">
                <span
                  className="h-2 w-2 rounded-full inline-block mr-2"
                  style={{ backgroundColor: item.color }}
                ></span>
                {item.label}
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {taskData.map((item, index) => (
            <div
              key={index}
              className="processBox"
              style={{ backgroundColor: item.color }}
            >
              <div>
                {item.label}: <span>{item.quantity}</span>
              </div>
            </div>
          ))}
          <div className="processBox">Total: {tasksUser.length}</div>
        </div>
      </div>
    </div>
  );
};

export default TasksStatus;
