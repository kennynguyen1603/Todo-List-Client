import PropTypes from "prop-types";
import AvatarDefault from "@svg/AvatarDefault";
const AvatarGroup = ({ avatars, maxVisible = 5, size = 10 }) => {
  const extraAvatars = avatars.length - maxVisible;
  return (
    <div className="flex -space-x-2">
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <div
          key={index}
          className={`w-${size} h-${size} rounded-full ring-2 ring-white relative`}
          style={{
            zIndex: 10 - index,
          }}
        >
          {avatar ? (
            <img
              src={avatar}
              alt="Av"
              className="w-full h-full object-cover aspect-square rounded-full"
            />
          ) : (
            <AvatarDefault size="16" />
          )}
        </div>
      ))}
      {extraAvatars > 0 && (
        <div
          className={`w-${size} h-${size} rounded-full bg-gray-500 text-white flex items-center justify-center text-sm ring-2 ring-white relative`}
          style={{
            zIndex: 10 - maxVisible,
          }}
        >
          +{extraAvatars}
        </div>
      )}
    </div>
  );
};

AvatarGroup.propTypes = {
  avatars: PropTypes.array.isRequired,
  maxVisible: PropTypes.number,
  size: PropTypes.number,
};

export default AvatarGroup;
