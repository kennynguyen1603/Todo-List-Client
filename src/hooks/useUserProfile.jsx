import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import api from "@config/axios";
const useUserProfile = () => {
  const { authState } = useContext(AuthContext);
  const { user } = authState || {};

  const [editingSections, setEditingSections] = useState({
    profile: false,
    personalInfo: false,
  });

  const [userInfo, setUserInfo] = useState({
    avatarUrl: "",
    username: "",
    email: "",
    career: "",
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        avatarUrl: user.avatarUrl,
        username: user.username,
        email: user.email,
        career: user.career,
      });
    }
  }, [user]);

  const toggleEditing = (section) => {
    setEditingSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const avatar = e.target.files[0];
    if (avatar) {
      setUserInfo((prev) => ({
        ...prev,
        avatarUrl: URL.createObjectURL(avatar),
      }));
    }
  };

  const saveProfile = async () => {
    // Save the updated user info to the database
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      const config = {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      try {
        const response = await api.put(
          `/users/${user._id}`,
          {
            avatarUrl: userInfo.avatarUrl,
            username: userInfo.username,
            email: userInfo.email,
            career: userInfo.career,
          },
          config
        );
        if (response.status === 200) {
          // Update the user context
          const { username, email, career } = response.data.data;
          setUserInfo((prev) => ({
            ...prev,
            username,
            email,
            career,
          }));
          // Close the editing section
          setEditingSections({
            profile: false,
            personalInfo: false,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return {
    userInfo,
    editingSections,
    toggleEditing,
    handleInputChange,
    handleAvatarChange,
    saveProfile,
  };
};

export default useUserProfile;
