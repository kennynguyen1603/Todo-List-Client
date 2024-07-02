import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
ReactDOM.createRoot(document.getElementById("root")).render(
  // <GoogleOAuthProvider clientId={`${import.meta.env.GOOGLE_CLIENT_ID}`}>
  <GoogleOAuthProvider clientId="268565221108-6d7piebnrhp9kpqman3k1mnbpc2tekba.apps.googleusercontent.com">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GoogleOAuthProvider>
);
