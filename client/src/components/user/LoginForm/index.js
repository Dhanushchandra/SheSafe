import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Joi from "joi-browser";
import { useNavigate } from "react-router-dom";
const { USER_API } = require("../../../api");

// Joi schema for login validation
const schema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().min(6).required().label("Password"),
});

// Helper function to validate form values using Joi
const validate = (values) => {
  const { error } = schema.validate(values, { abortEarly: false });
  if (!error) return {};

  const errors = {};
  error.details.forEach((item) => {
    errors[item.path[0]] = item.message;
  });
  return errors;
};

// API call function
const loginUser = async (email, password) => {
  const response = await fetch(`${USER_API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    console.log("Login successful", data);
    localStorage.setItem("profile", JSON.stringify(data.data));
    localStorage.setItem("token", data.token);
    return data.data.id;
  } else {
    console.error("Login failed", data);
    return data.message || "Login failed";
  }
};

const LoginForm = () => {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validate={validate}
      onSubmit={async (values) => {
        const { email, password } = values;
        const userId = await loginUser(email, password);

        if (userId) {
          // Navigate to the user's dashboard after successful login
          navigate(`/user/${userId}/dashboard`);
        } else {
          // Optionally, handle post-login failure
          alert("Login failed");
        }
      }}
    >
      {() => (
        <Form>
          <div className="form-group mb-3">
            <label>Email</label>
            <Field name="email" type="email" className="form-control" />
            <ErrorMessage
              name="email"
              component="div"
              className="text-danger"
            />
          </div>

          <div className="form-group mb-3">
            <label>Password</label>
            <Field name="password" type="password" className="form-control" />
            <ErrorMessage
              name="password"
              component="div"
              className="text-danger"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
