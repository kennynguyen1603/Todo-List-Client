import { useRef, useEffect, useContext, memo } from "react";
import CartTodo from "../CardTask/CartTodo";
import PropTypes from "prop-types";
import { AuthContext } from "@context/AuthContext";

const TasksList = ({ tasksList }) => {
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
    elements.forEach((element) => observer.observe(element));

    return () => elements.forEach((element) => observer.unobserve(element));
  }, [tasksList]);

  return (
    <div className="task-list" ref={listRef}>
      <div className="list">
        {tasksList.map((task, index) => (
          <CartTodo
            key={task._id}
            task={task}
            index={index}
            id={task._id}
            title={task.title}
            description={task.description}
            due_date={task.due_date}
            processValue={task.processValue}
            priority={task.priority}
            creator={task.creatorId}
            members={task.members}
            setTasksUser={setTasksUser}
          />
        ))}
      </div>
    </div>
  );
};

TasksList.propTypes = {
  tasksList: PropTypes.array.isRequired,
};

const MemoizedTasksList = memo(TasksList);
export default MemoizedTasksList;
