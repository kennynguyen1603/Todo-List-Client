import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const CircularProgressBar = ({ percentage, color, children }) => {
  const [dimensions, setDimensions] = useState(() => {
    if (window.innerWidth < 1024) {
      return { size: 30, strokeWidth: 3 };
    }
    if (window.innerWidth < 1680) {
      return { size: 50, strokeWidth: 4 };
    }
    return { size: 60, strokeWidth: 5 };
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setDimensions({ size: 30, strokeWidth: 3 });
      } else if (window.innerWidth < 1680) {
        setDimensions({ size: 50, strokeWidth: 4 });
      } else {
        setDimensions({ size: 60, strokeWidth: 5 });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { size, strokeWidth } = dimensions;
  const radius = size / 2;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg height={size} width={size}>
      <circle
        stroke="#ddd"
        fill="transparent"
        strokeWidth={strokeWidth}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(-90 ${radius} ${radius})`}
      />
      <foreignObject x="0" y="0" width={size} height={size}>
        <div className="flex justify-center items-center h-full text-xs desktop:text-sm">
          {children || `${percentage}%`}
        </div>
      </foreignObject>
    </svg>
  );
};

CircularProgressBar.propTypes = {
  percentage: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default CircularProgressBar;
