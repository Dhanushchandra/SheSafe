import React from "react";
import { useParams } from "react-router-dom";
import UserNavbar from "../../components/user/NavBar";

const UserProfile = () => {
  const { userId } = useParams();

  const userProfile = JSON.parse(localStorage.getItem("profile"));

  return (
    <>
      <UserNavbar />
      <div className="container mt-5">
        <div className="card p-4 mt-3">
          <h4>Profile Details</h4>
          <br></br>
          <div className="row">
            <div className="col-md-6">
              <p>
                <strong>Username:</strong> {userProfile.username}
              </p>
              <p>
                <strong>Email:</strong> {userProfile.email}
              </p>
              <p>
                <strong>Phone:</strong> {userProfile.phone}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Aadhar:</strong> {userProfile.aadhar}
              </p>
              {/* Mask the password field for security reasons */}
              <p>
                <strong>Password:</strong> ********
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;
