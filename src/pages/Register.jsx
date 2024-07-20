// import { updateAuthorization } from "@/config/axios";
// import { AuthContext } from "@/context/AuthContext";
// import { saveInfoToLocalStorage } from "@/utils/product";
// import { Helmet } from "react-helmet";
// import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "@styles/auth.css";
import { Field, Form, Formik, useField, useFormikContext } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import api from "@config/axios.js";
import PropTypes from "prop-types";
import GoogleSignIn from "@components/login/GoogleSignIn";

const validationSchema = Yup.object().shape({
  username: Yup.string().min(6, "Too Short!").required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Too Short!").required("Password is required"),
  career: Yup.string().required("Career is required"),
});

// Custom error message component
const CustomErrorMessage = ({ name }) => {
  const [, meta] = useField(name);
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

const LogFormChanges = () => {
  const { values } = useFormikContext();

  useEffect(() => {
    console.log("Form values changed: ", values);
  }, [values]);

  return null;
};

// Register component
const Register = () => {
  const defaultAvatarUrl =
    "https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg";
  const [avatar, setAvatar] = useState(defaultAvatarUrl);
  const [avatarFile, setAvatarFile] = useState(null);

  const navigate = useNavigate();

  const handleAvatarChange = (event) => {
    const avatar = event.target.files[0];
    if (avatar) {
      const avatarUrl = URL.createObjectURL(avatar);
      console.log("Avatar: ", avatarUrl, avatar);
      setAvatar(avatarUrl);
      setAvatarFile(avatar);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("career", values.career);
    if (avatarFile) {
      formData.append("avatarUrl", avatarFile);
    }
    try {
      const response = await api.post("/auth/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Registration Successful");
      console.log(response.data);
      navigate("/auth/login");
      // Redirect or additional actions
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        alert("Registration Failed: " + error.response.data.message);
      } else if (error.request) {
        console.log(error.request);
        alert("Registration Failed: No response from server");
      } else {
        console.log("Error", error.message);
        alert("Registration Failed: " + error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-option">
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          career: "",
          avatarUrl: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="formContainer">
            <LogFormChanges />
            <div className="avatar">
              {avatar && (
                <img
                  src={avatar}
                  alt="Avatar Preview"
                  className="avatarPreview"
                />
              )}
            </div>
            <div className="inputField">
              <Field
                name="username"
                type="text"
                className="input"
                id="username"
                required
              />
              <label htmlFor="username" className="label">
                Username
              </label>
              <CustomErrorMessage name="username" />
            </div>
            <div className="inputField">
              <Field
                name="email"
                type="email"
                className="input"
                id="email"
                required
              />
              <label htmlFor="email" className="label">
                Email
              </label>
              <CustomErrorMessage name="email" />
            </div>
            <div className="inputField">
              <Field
                name="password"
                type="password"
                className="input"
                id="password"
                required
              />
              <label htmlFor="password" className="label">
                Password
              </label>
              <CustomErrorMessage name="password" />
            </div>
            <div className="inputField">
              <Field
                name="career"
                type="text"
                className="input"
                id="career"
                required
              />
              <label htmlFor="career" className="label">
                Career
              </label>
              <CustomErrorMessage name="career" />
            </div>
            <div className="inputField">
              <label htmlFor="avatarUpload">Upload Avatar</label>
              <input
                id="avatarUpload"
                name="avatar"
                type="file"
                onChange={handleAvatarChange}
                accept="image/*"
              />
            </div>
            <button
              type="submit"
              className="submitButton"
              disabled={isSubmitting}
            >
              Sign up
            </button>
          </Form>
        )}
      </Formik>
      <GoogleSignIn />
      <div className="signUp">
        <NavLink to="/auth/login" className="signUpLink">
          You have an account
        </NavLink>
      </div>
    </div>
  );
};

export default Register;
