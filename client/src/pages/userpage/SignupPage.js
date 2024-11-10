import React from "react";
import SignUpForm from "../../components/user/SignUpForm";

const SignUpPage = () => {
  return (
    <div className="signup-page d-flex justify-content-center align-items-center min-vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h3 className="text-center mb-4">Sign Up</h3>
        <SignUpForm />
        <div className="text-center mt-3">
          <p>
            Already have an account? <a href="/user/login">Log In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
