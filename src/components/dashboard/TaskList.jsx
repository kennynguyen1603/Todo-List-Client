// import PropTypes from "prop-types";
import { useRef, useEffect, useContext } from "react";
import CartTodo from "./CartTodo";
import PropTypes from "prop-types";
import { AuthContext } from "../../context/AuthContext";
const TaskList = ({ taskList }) => {
  const listRef = useRef(null);
  const { setTasksUser } = useContext(AuthContext);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    const elements = listRef.current.querySelectorAll(".task-item");
    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => elements.forEach((element) => observer.unobserve(element));
  }, [taskList]);

  return (
    <div className="task-list" ref={listRef}>
      <div className="list">
        {taskList.map((task, index) => (
          <CartTodo
            key={index}
            task={task}
            index={index}
            id={task._id}
            title={task.title}
            description={task.description}
            due_date={task.due_date}
            processValue={task.processValue}
            priority={task.priority}
            setTasksUser={setTasksUser}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskList;

TaskList.propTypes = {
  taskList: PropTypes.array.isRequired,
};
