import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../config/axios";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const [nameMap, setNameMap] = useState({});

  useEffect(() => {
    const fetchNames = async () => {
      const taskListIndex = pathnames.indexOf("taskList");
      if (taskListIndex !== -1) {
        const id = pathnames[taskListIndex + 1];
        if (id && !nameMap[id]) {
          try {
            const response = await api.get(`/todoList/${id}`);
            setNameMap((prev) => ({
              ...prev,
              [id]: response.data.data.name,
            }));
          } catch (error) {
            console.error("Failed to fetch task list name:", error);
          }
        }
      }
    };

    fetchNames();
  }, [pathnames, nameMap]);

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 rounded-md  mb-4 absolute right-[50%] translate-x-[-50%]">
      <ol className="list-reset flex text-gray-600">
        <li>
          <Link to="/" className="text-blue-500 hover:underline">
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;

          let name = value;
          if (value === "taskList") {
            name = "Task List";
          } else if (pathnames[index - 1] === "taskList") {
            name = nameMap[value] || value;
          }

          return (
            <li key={to} className="flex items-center">
              <span className="mx-2">/</span>
              {isLast ? (
                <span className="text-gray-500">{name}</span>
              ) : (
                <Link to={to} className="text-blue-500 hover:underline">
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
