import { GrAdd } from "react-icons/gr";

const ButtonAddTaskCalendar = () => {
  return (
    <button className="bg-blue-500 p-2 rounded-md group-hover/edit:bg-blue-900 active:bg-violet-700">
      <GrAdd className="text-xs text-white" />
    </button>
  );
};

export default ButtonAddTaskCalendar;
