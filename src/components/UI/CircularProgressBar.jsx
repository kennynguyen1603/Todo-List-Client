import Prototype from "prop-types";
const CircularProgressBar = ({ percentage, color, size, children }) => {
  const radius = size / 2;
  const stroke = 5;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <svg height={size} width={size}>
      <circle
        stroke="#ddd"
        fill="transparent"
        strokeWidth={stroke}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
      />
      <circle
        stroke={color}
        fill="transparent"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        r={normalizedRadius}
        cx={radius}
        cy={radius}
        transform={`rotate(-90 ${radius} ${radius})`}
      />
      <foreignObject x="0" y="0" width={size} height={size}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            fontSize: "0.8rem",
          }}
        >
          {children || `${percentage}%`}
        </div>
      </foreignObject>
    </svg>
  );
};

CircularProgressBar.propTypes = {
  percentage: Prototype.number.isRequired,
  color: Prototype.string.isRequired,
  size: Prototype.number.isRequired,
  children: Prototype.node,
};

export default CircularProgressBar;
