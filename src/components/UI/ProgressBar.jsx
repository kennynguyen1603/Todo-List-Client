import PropTypes from "prop-types";

const ProgressBar = ({ processValue, height = 8 }) => {
  return (
    <div
      className={`flex w-full bg-gray-200 rounded-full mb-2 dark:bg-gray-700 relative overflow-hidden`}
      style={{ height: `${height}px` }}
    >
      <div
        className="bg-blue-600 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${processValue}%` }}
      ></div>
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-glow"
        style={{ width: processValue }}
      ></div>
    </div>
  );
};

ProgressBar.propTypes = {
  processValue: PropTypes.string.isRequired,
  height: PropTypes.number,
};

export default ProgressBar;
