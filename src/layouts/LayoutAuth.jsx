// import React from "react";
import { Outlet } from "react-router-dom";
import "../styles/auth.css";
const LayoutAuth = () => {
  return (
    <div className="auth">
      <div className="container mx-auto auth-content">
        <div className="auth-left">
          <img
            src="https://res.cloudinary.com/dlotuochc/image/upload/v1715804857/fmqs49yxkb78gl8ik9jh.png"
            alt=""
          />
        </div>
        <div className="auth-right">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutAuth;
