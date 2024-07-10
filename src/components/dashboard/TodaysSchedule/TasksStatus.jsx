import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import CircularProgressBar from "@/components/ui/CircularProgressBar";

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

  const TaskItem = ({ label, quantity, color }) => (
    <div
      className="p-2 2xl:h-10 2xl:text-sm h-9 text-xs mr-2 rounded-lg flex justify-center items-center"
      style={{ backgroundColor: color }}
    >
      <div>
        {label}: <span>{quantity}</span>
      </div>
    </div>
  );

  return (
    <div className="taskStatus my-2">
      <p className="text-xl font-semibold my-4">Tasks Status</p>
      <div className="flex justify-between mb-4">
        <div className="flex flex-wrap justify-center gap-5 ml-2">
          {taskData.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <CircularProgressBar
                percentage={item.value}
                color={item.color}
                size={60}
                trokeWidth={5}
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
            <TaskItem
              key={index}
              label={item.label}
              quantity={item.quantity}
              color={item.color}
            />
          ))}
          <TaskItem label="Total" quantity={tasksUser.length} color="#F06292" />
        </div>
      </div>
    </div>
  );
};

export default TasksStatus;
