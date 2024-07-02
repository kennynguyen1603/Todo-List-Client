import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/auth.css";
import { Field, Form, Formik, useField } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../context/AuthContext";
import PropTypes from "prop-types";
import { BiHide, BiShow } from "react-icons/bi";
import GoogleSignIn from "@components/login/GoogleSignIn";
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
  name: PropTypes.string.isRequired,
};

const Login = () => {
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const initialValues = {
    username: "",
    password: "",
    rememberMe: false,
  };

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
        <img
          src="https://res.cloudinary.com/dlotuochc/image/upload/v1715889504/pt6vw2wuoayghks1n15z.png"
          alt="Logo"
        />
      </div>
      <Formik
        initialValues={initialValues}
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
            <Field
              name="password"
              type={showPassword ? "text" : "password"}
              className="input"
              required
            />
            <label className="label">Password</label>
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute top-[25%] right-2"
            >
              {showPassword ? <BiHide /> : <BiShow />}
            </button>
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
