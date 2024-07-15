import EditProfilePencil from "@svg/EditProfilePencil";
import TickIcon from "@svg/TickIcon";
import PropTypes from "prop-types";
import { MdCancel } from "react-icons/md";

const ProfileSection = ({
  title,
  children,
  isEditing,
  toggleEditing,
  saveProfile,
}) => (
  <section className="p-6 border-[1px] flex justify-between border-gray-100 rounded-md shadow-sm relative">
    <div className="flex items-center gap-8 w-full">
      <div>
        {title && <p className="font-bold text-base mb-6">{title}</p>}
        {children}
      </div>
    </div>
    {isEditing ? (
      <div className="h-[2.5rem] text-gray text-sm font-normal absolute right-2 top-2 cursor-pointer flex gap-2">
        <button className="" onClick={() => saveProfile()}>
          <TickIcon verified={true} />
        </button>
        <button className="text-xl" onClick={toggleEditing}>
          <MdCancel />
        </button>
      </div>
    ) : (
      <div
        className="h-[2.5rem] text-gray text-sm font-normal border-[1px] border-gray-200 rounded-md inline-flex items-center p-2 justify-between gap-2 absolute right-2 top-2 cursor-pointer"
        onClick={toggleEditing}
      >
        Edit
        <EditProfilePencil />
      </div>
    )}
  </section>
);

ProfileSection.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  isEditing: PropTypes.bool.isRequired,
  toggleEditing: PropTypes.func.isRequired,
};

export default ProfileSection;
