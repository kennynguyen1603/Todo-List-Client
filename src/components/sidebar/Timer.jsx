import { useEffect, useRef } from "react";

const formatDate = (date) => {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayOfWeek = dayNames[date.getDay()];
  const dayOfMonth = String(date.getDate()).padStart(2, "0");
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${dayOfWeek} ${dayOfMonth} ${month} ${year}`;
};

const formatTime = (date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

const Timer = () => {
  const timeRef = useRef();
  const dateRef = useRef();
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      if (timeRef.current && dateRef.current) {
        dateRef.current.textContent = `${formatDate(now)}`;
        timeRef.current.textContent = `${formatTime(now)}`;
      }
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="timer-container">
      {/* <div className=""> */}
      <div className="timer-date" ref={dateRef}></div>
      <div className="timer-time" ref={timeRef}></div>
      {/* </div> */}
    </div>
  );
};

export default Timer;
export { formatDate };
