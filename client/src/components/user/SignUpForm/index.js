import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Joi from "joi-browser";
import { useNavigate } from "react-router-dom";
import { USER_API } from "../../../api";

// Joi schema for form validation, including password fields
const schema = Joi.object({
  name: Joi.string().min(3).max(30).required().label("Name"),
  email: Joi.string().email().required().label("Email"),
  phone: Joi.string().length(10).regex(/^\d+$/).required().label("Phone"),
  aadhar: Joi.string().length(12).regex(/^\d+$/).required().label("Aadhar"),
  password: Joi.string().min(6).required().label("Password"),
  confirmPassword: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .label("Confirm Password")
    .options({
      language: { any: { allowOnly: "must match password" } },
    }),
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
const signupUser = async (values) => {
  const { name, email, phone, aadhar, password } = values;

  const response = await fetch(`${USER_API}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: name,
      email: email,
      password: password,
      phone: phone,
      aadhar: aadhar,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    // Handle successful signup
    console.log("Signup successful", data);
    return true; // Successful signup
  } else {
    // Handle signup failure
    console.error("Signup failed", data);
    return data.data.error || "Signup failed";
  }
};

const SignUpForm = () => {
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        name: "",
        email: "",
        phone: "",
        aadhar: "",
        password: "",
        confirmPassword: "",
      }}
      validate={validate}
      onSubmit={async (values) => {
        const result = await signupUser(values);

        if (result === true) {
          alert("Signup successful!");
          navigate("/user/login");
        } else {
          alert(result);
        }
      }}
    >
      {() => (
        <Form>
          <div className="form-group mb-3">
            <label>Name</label>
            <Field name="name" type="text" className="form-control" />
            <ErrorMessage name="name" component="div" className="text-danger" />
          </div>

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
            <label>Phone</label>
            <Field name="phone" type="text" className="form-control" />
            <ErrorMessage
              name="phone"
              component="div"
              className="text-danger"
            />
          </div>

          <div className="form-group mb-3">
            <label>Aadhar</label>
            <Field name="aadhar" type="text" className="form-control" />
            <ErrorMessage
              name="aadhar"
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

          <div className="form-group mb-3">
            <label>Confirm Password</label>
            <Field
              name="confirmPassword"
              type="password"
              className="form-control"
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="text-danger"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default SignUpForm;
