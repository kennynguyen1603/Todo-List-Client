import { useState, useEffect, useRef } from "react";
import { FaPlay, FaRegCircleStop } from "react-icons/fa6";
import { FaRegPauseCircle } from "react-icons/fa";

const TimeTracker = ({ onStartTracking, onStopTracking }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [lastStartTime, setLastStartTime] = useState(null);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - startTimeRef.current);
      }, 1000);
    } else if (!isTracking && startTimeRef.current !== null) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isTracking]);

  const handleStartStop = () => {
    if (isTracking) {
      onStopTracking(elapsedTime);
      setIsTracking(false);
      startTimeRef.current = null;
    } else {
      onStartTracking();
      setIsTracking(true);
      startTimeRef.current = Date.now();
      setElapsedTime(0);
    }
  };

  const handlePauseContinue = () => {
    if (isTracking) {
      setIsTracking(false);
      clearInterval(timerRef.current);
    } else {
      setIsTracking(true);
      startTimeRef.current = Date.now();
    }
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
      2,
      "0"
    );
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(elapsedTime);

  const displatTime = () => {
    return (
      <div className="time-display flex text-xl text-customGreen font-medium ">
        {/* <div>Time elapsed: </div> */}
        <span>{hours}</span>
        <span className="time-separator px-1">:</span>
        <span>{minutes}</span>
        <span className="time-separator px-1">:</span>
        <span>{seconds}</span>
      </div>
    );
  };
  return (
    <div className="time-tracker">
      <div className="flex flex-col pl-1 items-start">
        <span className="font-medium text-xl h-1/2">Project time tracker</span>
        {isTracking ? (
          displatTime()
        ) : (
          <span className="text-gray71 font-normal text-lg ">
            You can start tracking.
          </span>
        )}
      </div>
      {isTracking ? (
        <div className="flex gap-2">
          {/* <span className="play-icon">
            <FaRegPauseCircle className="icon" onClick={handlePauseContinue} />
          </span> */}
          <span className="play-icon" onClick={handleStartStop}>
            <FaRegCircleStop className="icon" />
          </span>
        </div>
      ) : (
        <span className="play-icon" onClick={handleStartStop}>
          <FaPlay className="icon" onClick={handleStartStop} />
        </span>
      )}
    </div>
  );
};

export default TimeTracker;
