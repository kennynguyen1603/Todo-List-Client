import ProfileSection from "@components/profile/ProfileSection";
import EditableInput from "@components/profile/EditableInput";
import useUserProfile from "@hooks/useUserProfile";

function Profile() {
  const {
    userInfo,
    editingSections,
    toggleEditing,
    handleInputChange,
    handleAvatarChange,
    saveProfile,
  } = useUserProfile();

  if (!userInfo.username) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-3/4">
        <p className="font-bold text-xl mb-5">My Profile</p>
        <div className="flex flex-col gap-6">
          <ProfileSection
            isEditing={editingSections.profile}
            toggleEditing={() => toggleEditing("profile")}
            saveProfile={saveProfile}
          >
            <div className="flex items-center gap-8">
              <img
                className="laptop:w-[6rem] laptop:h-[6rem] desktop:w-[9rem] desktop:h-[9rem] rounded-[50%] object-contain"
                src={userInfo.avatarUrl}
                alt={`${userInfo.username}'s avatar`}
              />
              {editingSections.profile && (
                <div className="absolute top-[50%] right-0">
                  <EditableInput
                    label="Avatar"
                    type="file"
                    name="avatarUrl"
                    isEditing={editingSections.profile}
                    onChange={handleAvatarChange}
                    accept="image/*"
                  />
                </div>
              )}
              <div>
                <p className="font-bold text-xl mb-4">{userInfo.username}</p>
                <p className="font-bold text-xs mb-1">
                  Lorem ipsum dolor sit amet consectetur.
                </p>
                <p className="text-gray-300">Lorem ipsum dolor sit amet.</p>
              </div>
            </div>
          </ProfileSection>
          <ProfileSection
            title="Personal Information"
            isEditing={editingSections.personalInfo}
            toggleEditing={() => toggleEditing("personalInfo")}
            saveProfile={saveProfile}
          >
            <div className="flex gap-20">
              <EditableInput
                label="Full Name"
                type="text"
                name="username"
                value={userInfo.username}
                isEditing={editingSections.personalInfo}
                onChange={handleInputChange}
              />
              <EditableInput
                label="Email"
                type="email"
                name="email"
                value={userInfo.email}
                isEditing={editingSections.personalInfo}
                onChange={handleInputChange}
              />
              <EditableInput
                label="Career"
                type="text"
                name="career"
                value={userInfo.career}
                isEditing={editingSections.personalInfo}
                onChange={handleInputChange}
              />
            </div>
          </ProfileSection>
        </div>
      </div>
    </div>
  );
}

export default Profile;
