// import { saveInfoToLocalStorage } from "@/utils/product";
// import { Helmet } from "react-helmet";
import { NavLink } from "react-router-dom";
import "../styles/auth.less";
import { Field, Form, Formik, useField } from "formik";
import * as Yup from "yup";
import { FcGoogle } from "react-icons/fc";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Prototype from "prop-types";

const validationSchema = Yup.object().shape({
  username: Yup.string().min(6, "Too Short!").required("Username is required"),
  password: Yup.string().min(6, "Too Short!").required("Password is required"),
});

// Custom error message component
const CustomErrorMessage = ({ name }) => {
  const [field, meta] = useField(name);
  return (
    <div
      className={`errorMessage ${meta.touched && meta.error ? "shown" : ""}`}
    >
      {meta.error && meta.touched && <div>{meta.error}</div>}
    </div>
  );
};

CustomErrorMessage.propTypes = {
  name: Prototype.string.isRequired,
};

const GoogleSignIn = () => {
  return (
    <div className="authSection">
      <div className="separator">
        <hr className="line" />
        <span className="or">or</span>
        <hr className="line" />
      </div>
      <button className="googleSignIn">
        <FcGoogle className="googleIcon" />
        Sign in with Google
      </button>
      <div className="signUp">
        Are you new?{" "}
        <NavLink to="/auth/register" className="signUpLink">
          Create an Account
        </NavLink>
      </div>
    </div>
  );
};

const Login = () => {
  const { login } = useContext(AuthContext);
  const handleSubmitLogin = async (values, { setSubmitting }) => {
    try {
      await login(values.username, values.password);
    } catch (error) {
      console.error("Login Failed:", error.response.data.message);
      alert("Login Failed: " + error.response.data.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-option">
      <div className="logo">
        <img src="https://res.cloudinary.com/dlotuochc/image/upload/v1715889504/pt6vw2wuoayghks1n15z.png" />
      </div>
      <Formik
        initialValues={{ username: "", password: "", rememberMe: false }}
        validationSchema={validationSchema}
        onSubmit={handleSubmitLogin}
      >
        <Form className="formContainer">
          <div className="inputField">
            <Field name="username" type="text" className="input" required />
            <label className="label">Username</label>
            <CustomErrorMessage name="username" />
          </div>
          <div className="inputField">
            <Field name="password" type="password" className="input" required />
            <label className="label">Password</label>
            <CustomErrorMessage name="password" />
          </div>
          <div className="relative">
            <NavLink to="forgot-password">
              <p className="underline underline-offset-2 absolute bottom-0 right-0 text-customGreen">
                Forgot password
              </p>
            </NavLink>
          </div>
          <button type="submit" className="submitButton">
            Sign in
          </button>
        </Form>
      </Formik>
      <GoogleSignIn />
    </div>
  );
};
export default Login;
