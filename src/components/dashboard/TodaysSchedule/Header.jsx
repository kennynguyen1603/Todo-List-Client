import AccessibleBadges from "./AccessibleBadges";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

const Header = ({ user }) => {
  const navigate = useNavigate();
  if (!user) {
    return <div>Loading user data...</div>;
  }
  return (
    <div
      className="flex justify-between items-center mb-4 hover:cursor-pointer hover:bg-gray-100 p-4 rounded-md shadow-sm"
      onClick={() => navigate("/profile")}
    >
      <div className="flex items-center gap-3">
        <img
          src={user?.avatarUrl}
          alt={user?.username}
          className="w-16 h-16 rounded-full object-contain aspect-square"
        />
        <div>
          <p className="font-medium">{user?.username}</p>
          <p className="font-medium text-gray-400">{user?.career}</p>
        </div>
      </div>
      <div className="elements flex">
        <AccessibleBadges />
      </div>
      {/* Other elements like notifications, dropdown, etc. */}
    </div>
  );
};
export default Header;

Header.propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    username: PropTypes.string,
    career: PropTypes.string,
  }),
};
