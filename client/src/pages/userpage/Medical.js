import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UserNavbar from "../../components/user/NavBar";

const MedicalPage = () => {
  // Access the userId from the URL using useParams
  const { userId } = useParams();

  const [medicalInfo, setMedicalInfo] = useState({
    hasAllergies: false,
    hasPreExistingConditions: false,
    requiresRegularMedication: false,
    requiresEmergencyTreatment: false,
  });

  useEffect(() => {
    const userProfile = JSON.parse(localStorage.getItem("profile"));
    if (userProfile && userProfile.medicals) {
      setMedicalInfo(userProfile.medicals);
    }
  }, []);

  // Function to handle form changes
  const handleInputChange = (e) => {
    const { name, checked } = e.target;
    setMedicalInfo({
      ...medicalInfo,
      [name]: checked,
    });
  };

  // Function to submit the updated medical information
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    try {
      const response = await fetch(
        `http://localhost:8060/api/user/updatemedicals/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            medicals: medicalInfo,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        const updatedProfile = JSON.parse(localStorage.getItem("profile"));
        updatedProfile.medicals = medicalInfo;
        localStorage.setItem("profile", JSON.stringify(updatedProfile));
        alert("Medical information updated successfully!");
      } else {
        alert("Failed to update medical information.");
        console.error(data);
      }
    } catch (error) {
      console.error("Error updating medical information:", error);
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="container mt-5">
        <div className="card p-4 mt-3">
          <h4>Update Medical Details</h4>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="hasAllergies"
                    checked={medicalInfo.hasAllergies}
                    onChange={handleInputChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label">Has Allergies</label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="hasPreExistingConditions"
                    checked={medicalInfo.hasPreExistingConditions}
                    onChange={handleInputChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label">
                    Has Pre-Existing Conditions
                  </label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="requiresRegularMedication"
                    checked={medicalInfo.requiresRegularMedication}
                    onChange={handleInputChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label">
                    Requires Regular Medication
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="requiresEmergencyTreatment"
                    checked={medicalInfo.requiresEmergencyTreatment}
                    onChange={handleInputChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label">
                    Requires Emergency Treatment
                  </label>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Update Medical Info
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default MedicalPage;
