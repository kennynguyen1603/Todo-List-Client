import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Profile() {
  const { authState } = useContext(AuthContext);
  const { user } = authState || {};
  return (
    <div className=" flex justify-center items-center py-10">
      <div className="w-[50rem]">
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
              <svg
                width="1rem"
                height="1rem"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.4998 5.49994L18.3282 8.32837M3 20.9997L3.04745 20.6675C3.21536 19.4922 3.29932 18.9045 3.49029 18.3558C3.65975 17.8689 3.89124 17.4059 4.17906 16.9783C4.50341 16.4963 4.92319 16.0765 5.76274 15.237L17.4107 3.58896C18.1918 2.80791 19.4581 2.80791 20.2392 3.58896C21.0202 4.37001 21.0202 5.63634 20.2392 6.41739L8.37744 18.2791C7.61579 19.0408 7.23497 19.4216 6.8012 19.7244C6.41618 19.9932 6.00093 20.2159 5.56398 20.3879C5.07171 20.5817 4.54375 20.6882 3.48793 20.9012L3 20.9997Z"
                  stroke="#77878F"
                  // stroke-width="2"
                  // stroke-linecap="round"
                  // stroke-linejoin="round"
                />
              </svg>
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
              <svg
                width="1rem"
                height="1rem"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.4998 5.49994L18.3282 8.32837M3 20.9997L3.04745 20.6675C3.21536 19.4922 3.29932 18.9045 3.49029 18.3558C3.65975 17.8689 3.89124 17.4059 4.17906 16.9783C4.50341 16.4963 4.92319 16.0765 5.76274 15.237L17.4107 3.58896C18.1918 2.80791 19.4581 2.80791 20.2392 3.58896C21.0202 4.37001 21.0202 5.63634 20.2392 6.41739L8.37744 18.2791C7.61579 19.0408 7.23497 19.4216 6.8012 19.7244C6.41618 19.9932 6.00093 20.2159 5.56398 20.3879C5.07171 20.5817 4.54375 20.6882 3.48793 20.9012L3 20.9997Z"
                  stroke="#77878F"
                  // stroke-width="2"
                  // stroke-linecap="round"
                  // stroke-linejoin="round"
                />
              </svg>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Profile;
