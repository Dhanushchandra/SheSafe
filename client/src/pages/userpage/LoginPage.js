import React from "react";
import LoginForm from "../../components/user/LoginForm";
// import "./LoginPage.css"; // Import custom CSS for additional styles

const LoginPage = () => {
  return (
    <div className="login-page d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4">Log In</h3>
        <LoginForm />
        <div className="text-center mt-3">
          <p>
            Don't have an account? <a href="/user/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
