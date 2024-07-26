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
      className="desktop:h-10 laptop:h-[35px] desktop:text-sm desktop:mt-1.5 p-1 text-xs rounded-lg flex justify-center items-center"
      style={{ backgroundColor: color }}
    >
      <div>
        {label}: <span>{quantity}</span>
      </div>
    </div>
  );

  return (
    <div className="taskStatus">
      <p className="destop:text-xl laptop:text-lg font-semibold my-3">
        Tasks Status
      </p>
      <div className="flex items-center desktop:justify-between justify-around mb-4">
        <div className="flex flex-wrap justify-center desktop:gap-5 laptop:gap-2 desktop:ml-10">
          {taskData.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <CircularProgressBar percentage={item.value} color={item.color}>
                {`${item.value}%`}
              </CircularProgressBar>
              <div className="flex items-center mt-2 text-sm">
                <span
                  className="h-1.5 w-1.5 desktop:h-2 desktop:w-2 rounded-full inline-block mr-1.5"
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
