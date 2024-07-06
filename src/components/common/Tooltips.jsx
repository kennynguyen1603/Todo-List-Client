import { useState } from "react";
import PropTypes from "prop-types";

const Tooltips = ({ title, placement = "top", children }) => {
  const [visible, setVisible] = useState(false);
  const showTooltip = () => setVisible(true);
  const hideTooltip = () => setVisible(false);

  const tooltipPosition = {
    top: "top-[-10px] left-1/2 -translate-x-1/2 -translate-y-full",
    bottom: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full",
    left: "left-0 top-1/2 -translate-x-full -translate-y-1/2",
    right: "right-[-10px] top-1/2 translate-x-full -translate-y-1/2",
  };

  return (
    <div className="relative">
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        className="cursor-pointer"
      >
        {children}
      </div>
      <div
        className={`absolute z-10 p-2 text-white bg-gray-700 rounded-md text-[11px] leading-3 shadow-lg transition-opacity duration-300 ease-in-out ${
          visible ? "opacity-100" : "opacity-0"
        } ${tooltipPosition[placement]}`}
      >
        {title}
      </div>
    </div>
  );
};

Tooltips.propTypes = {
  title: PropTypes.string.isRequired,
  placement: PropTypes.string,
  children: PropTypes.node,
};

export default Tooltips;
