import AccessibleBadges from "./AccessibleBadges";
import PropTypes from "prop-types";
const Header = ({ user }) => {
  if (!user) {
    return <div>Loading user data...</div>;
  }
  return (
    <div className="header">
      <div className="inforUser">
        <img
          src={user?.avatarUrl}
          alt={user?.username}
          className="profile-pic"
        />
        <div>
          <p className="profile-name">{user?.username}</p>
          <p className="profile-career">{user?.career}</p>
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
