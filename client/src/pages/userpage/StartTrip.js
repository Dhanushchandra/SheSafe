import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import UserNavbar from "../../components/user/NavBar";
import { USER_API } from "../../api";

const StartTrip = () => {
  const { userId } = useParams();
  const [photo, setPhoto] = useState(null);
  const navigate = useNavigate();

  // Initial values for the form
  const initialValues = {
    startLocation: {
      latitude: 0,
      longitude: 0,
    },
    endLocation: {
      latitude: 0,
      longitude: 0,
    },
    currentState: {
      intoxicated: false,
      feelingUnwell: false,
    },
    photo: null,
  };

  // Validation Schema
  const validationSchema = Yup.object({
    startLocation: Yup.object({
      latitude: Yup.number().required("Latitude is required").nullable(),
      longitude: Yup.number().required("Longitude is required").nullable(),
    }),
    endLocation: Yup.object({
      latitude: Yup.number().required("Latitude is required").nullable(),
      longitude: Yup.number().required("Longitude is required").nullable(),
    }),
    currentState: Yup.object({
      intoxicated: Yup.boolean(),
      feelingUnwell: Yup.boolean(),
    }),
    photo: Yup.mixed().required("Photo is required"),
  });

  // Handle form submission
  const handleSubmit = async (values) => {
    const { startLocation, endLocation, currentState, photo } = values;

    // Retrieve token from localStorage (adjust the key if needed)
    const token = localStorage.getItem("token");

    // Create a FormData object for the photo upload
    const formData = new FormData();
    formData.append("photo", photo);

    try {
      console.log(currentState);

      // First API call: Start Trip
      const tripResponse = await fetch(`${USER_API}/starttrip/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startLocation,
          endLocation,
          currentstate: currentState,
        }),
      });

      if (!tripResponse.ok) {
        throw new Error("Failed to start trip");
      }

      // Second API call: Upload Photo
      const photoResponse = await fetch(`${USER_API}/upload/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Pass token here for file upload
        },
        body: formData, // Send FormData object for file upload
      });

      if (!photoResponse.ok) {
        throw new Error("Failed to upload photo");
      }

      // Successfully updated both trip and photo
      alert("Trip started and photo uploaded successfully!");

      // Redirect to the dashboard
      navigate(`/user/${userId}/dashboard`);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setPhoto(file);
  };

  return (
    <>
      <UserNavbar />
      <div className="container mt-4">
        <h3>Start Your Trip</h3>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className="form-group">
                <label>Start Location</label>
                <div>
                  <Field
                    type="number"
                    name="startLocation.latitude"
                    className="form-control"
                    placeholder="Latitude"
                  />
                  <ErrorMessage
                    name="startLocation.latitude"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div>
                  <Field
                    type="number"
                    name="startLocation.longitude"
                    className="form-control"
                    placeholder="Longitude"
                  />
                  <ErrorMessage
                    name="startLocation.longitude"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>
              <br />
              <div className="form-group">
                <label>End Location</label>
                <div>
                  <Field
                    type="number"
                    name="endLocation.latitude"
                    className="form-control"
                    placeholder="Latitude"
                  />
                  <ErrorMessage
                    name="endLocation.latitude"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div>
                  <Field
                    type="number"
                    name="endLocation.longitude"
                    className="form-control"
                    placeholder="Longitude"
                  />
                  <ErrorMessage
                    name="endLocation.longitude"
                    component="div"
                    className="text-danger"
                  />
                </div>
              </div>
              <br />
              <div className="form-group">
                <label>Medical</label>
                <div>
                  <Field type="checkbox" name="currentState.intoxicated" />{" "}
                  Intoxicated
                  <br />
                  <Field
                    type="checkbox"
                    name="currentState.feelingUnwell"
                  />{" "}
                  Feeling Unwell
                </div>
              </div>
              <br />
              <div className="form-group">
                <label>Upload Photo</label>
                <input
                  type="file"
                  className="form-control"
                  name="photo"
                  onChange={(event) => {
                    handleFileChange(event);
                    setFieldValue("photo", event.currentTarget.files[0]);
                  }}
                />
                <ErrorMessage
                  name="photo"
                  component="div"
                  className="text-danger"
                />
                {photo && <p>File selected: {photo.name}</p>}
              </div>

              <button type="submit" className="btn btn-primary mt-3">
                Start Trip
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default StartTrip;
