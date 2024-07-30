import AccessibleBadges from "./AccessibleBadges";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
const Header = ({ user }) => {
  const navigate = useNavigate();
  if (!user) {
    return <div>Loading user data...</div>;
  }
  return (
    <div className="flex justify-between items-center desktop:p-4 laptop:p-2 mb-4  hover:bg-gray-100 rounded-md shadow-sm">
      <div
        className="flex items-center gap-3 hover:cursor-pointer"
        onClick={() => navigate("/profile")}
      >
        <img
          src={user?.avatarUrl}
          alt={user?.username}
          className="desktop:w-16 laptop:w-[3.4rem] rounded-full object-contain aspect-square"
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

Header.propTypes = {
  user: PropTypes.shape({
    avatarUrl: PropTypes.string,
    username: PropTypes.string,
    career: PropTypes.string,
  }),
};

export default Header;
