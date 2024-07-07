import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import EditProfilePencil from "@/svg/EditProfilePencil";

function Profile() {
  const { authState } = useContext(AuthContext);
  const { user } = authState || {};
  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-3/4">
        <p className="font-bold text-xl mb-5">My Profile</p>
        <div className="flex flex-col gap-6">
          <section className="p-6 border-[1px] flex justify-between  border-gray-100 rounded-md shadow-sm">
            <div className="flex items-center gap-8">
              <img
                className="w-[9rem] h-[9rem] rounded-[50%] object-contain"
                src={`${user.avatarUrl}`}
              ></img>
              <div>
                <p className="font-bold text-xl mb-4">{user.username}</p>
                <p className="font-bold text-xs mb-1">
                  Lorem ipsum dolor sit amet consectetur.
                </p>
                <p className="text-gray-300">Lorem ipsum dolor sit amet.</p>
              </div>
            </div>
            <div className="h-[2.5rem] text-gray text-sm font-normal border-[1px] border-gray-100 rounded-md  inline-flex items-center p-2 justify-between gap-2">
              Edit
              <EditProfilePencil />
            </div>
          </section>
          <section className="p-6 border-[1px] flex justify-between  border-gray-100 rounded-md shadow-sm">
            <div className="flex items-center gap-8">
              <div>
                <p className="font-bold text-base mb-6">Personal Information</p>
                <section className="flex gap-20">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm mb-1 text-gray-300">Full Name</p>
                    <p className="text-sm "> {user.username}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm mb-1 text-gray-300">Email</p>
                    <p className="text-sm "> {user.email}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm mb-1 text-gray-300">Career</p>
                    <p className="text-sm "> {user.career}</p>
                  </div>
                </section>
              </div>
            </div>
            <div className="h-[2.5rem] text-gray font-normal text-sm border-[1px] border-gray-100 rounded-md  inline-flex items-center p-2 justify-between gap-2">
              Edit
              <EditProfilePencil />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
