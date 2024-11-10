import React from "react";
import LoginForm from "../../components/authoritie/LoginForm";

const AuthLoginPage = () => {
  return (
    <div className="login-page d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4">Log In</h3>
        <LoginForm />
      </div>
    </div>
  );
};

export default AuthLoginPage;
