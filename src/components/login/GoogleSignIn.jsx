import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { NavLink } from "react-router-dom";
import api, { updateAuthorization } from "../../config/axios";
const GoogleSignIn = () => {
  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const { access_token } = response;

        const res = await api.post("/auth/google/callback", {
          token: access_token,
        });
        const data = await res.data;

        // await Login(data.username, data.accessToken);

        // Save tokens and user info in local storage or state
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("accessToken", data.token.accessToken);
        localStorage.setItem("refreshToken", data.token.refreshToken);
        updateAuthorization(data.token.accessToken);

        // Redirect to home page
        window.location.href = "/dashboard";
      } catch (error) {
        console.error("Login Error:", error);
      }
    },
    onFailure: (error) => {
      console.error("Login Failed:", error);
    },
  });

  return (
    <div className="authSection">
      <div className="separator">
        <hr className="line" />
        <span className="or">or</span>
        <hr className="line" />
      </div>
      <button className="googleSignIn" onClick={googleLogin}>
        <FcGoogle className="googleIcon" />
        Sign in with Google
      </button>
      {/* <div className="signUp">
        Are you new?{" "}
        <NavLink to="/auth/register" className="signUpLink">
          Create an Account
        </NavLink>
      </div> */}
    </div>
  );
};

export default GoogleSignIn;
