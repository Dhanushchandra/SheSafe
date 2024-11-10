import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import UserNavbar from "../../components/user/NavBar";
import { USER_API } from "../../api";

const UserDashBoard = () => {
  const { userId } = useParams();

  const [tripDetails, setTripDetails] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch trip details
  const fetchTripDetails = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${USER_API}/gettrip/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch trip details");
      }

      const data = await response.json();
      console.log(data);

      if (data) {
        setTripDetails(data.data); // Set the fetched trip data

        localStorage.setItem("trip", data.data._id);
      } else {
        setTripDetails(null); // No active trip
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Cancel Trip Function (Delete the trip)
  const cancelTrip = async () => {
    const token = localStorage.getItem("token");

    if (!tripDetails) {
      alert("No active trip to cancel");
      return;
    }

    try {
      const response = await fetch(
        `${USER_API}/updatetrip/${tripDetails._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to cancel the trip");
      }

      setTripDetails(null); // Reset the trip details after cancellation
      alert("Trip has been canceled");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Panic Function (Send current location)
  const handlePanic = async () => {
    const token = localStorage.getItem("token");

    // Function to get the current location
    const getCurrentLocation = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            resolve(location);
          },
          (error) => {
            reject(error);
          }
        );
      });
    };

    try {
      // Get the current location
      const location = await getCurrentLocation();

      // Send the location in the Panic request
      const response = await fetch(`${USER_API}/panic/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ location }),
      });

      if (!response.ok) {
        throw new Error("Panic request failed");
      }

      alert("Panic button activated and current location sent!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Effect to fetch trip details on component mount
  useEffect(() => {
    fetchTripDetails();
  }, [userId]);

  return (
    <>
      <UserNavbar />
      <div className="container mt-4">
        {/* Panic Button */}
        <button className="btn btn-danger" onClick={handlePanic}>
          Panic Button
        </button>

        {/* Start Trip Button */}
        <Link to={`/user/${userId}/tripstart`} className="btn btn-primary ms-3">
          Start Trip
        </Link>

        {/* Error handling */}
        {error && <div className="alert alert-danger mt-3">{error}</div>}

        {/* Show Trip Details if Trip is Started */}
        {tripDetails ? (
          <div className="mt-4">
            <h5>Trip Details:</h5>
            <div className="border p-3 mb-3">
              <p>
                <strong>Start Location:</strong> Latitude:{" "}
                {tripDetails.startLocation.latitude}, Longitude:{" "}
                {tripDetails.startLocation.longitude}
              </p>
              <p>
                <strong>End Location:</strong> Latitude:{" "}
                {tripDetails.endLocation.latitude}, Longitude:{" "}
                {tripDetails.endLocation.longitude}
              </p>
            </div>

            {/* Cancel Trip Button */}
            <button className="btn btn-danger" onClick={cancelTrip}>
              Cancel Trip
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <p>No active trip</p>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDashBoard;
