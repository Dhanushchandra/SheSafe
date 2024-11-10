import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/UserNavbar.css";
import { USER_API } from "../../../api";

const UserNavbar = () => {
  const { userId } = useParams();
  const [lastLocation, setLastLocation] = useState(null);
  const [lastChangeTime, setLastChangeTime] = useState(Date.now());
  const [hasTriggeredPanic, setHasTriggeredPanic] = useState(false);

  useEffect(() => {
    const tripId = localStorage.getItem("trip");
    const token = localStorage.getItem("token");

    if (!tripId || !token) {
      console.error("Trip ID or token is missing");
      return;
    }

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

    const sendLocation = async () => {
      try {
        const location = await getCurrentLocation();

        // Check if location has changed and if panic has not been triggered
        if (
          lastLocation &&
          lastLocation.latitude === location.latitude &&
          lastLocation.longitude === location.longitude &&
          !hasTriggeredPanic
        ) {
          // Check if location has been unchanged for 20 seconds
          if (Date.now() - lastChangeTime >= 20000) {
            // Trigger panic API
            const panicResponse = await fetch(`${USER_API}/panic/${userId}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ location }),
            });

            if (!panicResponse.ok) {
              throw new Error("Failed to trigger panic alert");
            }

            alert("Panic alert triggered due to stationary location");
            setHasTriggeredPanic(true); // Stop further alerts
          }
        } else {
          // Update location and reset timer if location has changed
          setLastLocation(location);
          setLastChangeTime(Date.now());
          setHasTriggeredPanic(false); // Reset panic flag if location changes
        }

        // Send the location data to the live tracking API
        const response = await fetch(`${USER_API}/live/${userId}/${tripId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ location }),
        });

        if (!response.ok) {
          throw new Error("Failed to send location data");
        }

        console.log("Location data sent successfully");
      } catch (error) {
        console.error("Error sending location data:", error);
      }
    };

    const intervalId = setInterval(() => {
      sendLocation();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [userId, lastLocation, lastChangeTime, hasTriggeredPanic]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to={`/user/${userId}/dashboard`}>
          SheSafe
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to={`/user/${userId}/dashboard`}>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={`/user/${userId}/profile`}>
                Profile
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={`/user/${userId}/contacts`}>
                Contacts
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={`/user/${userId}/medical`}>
                Medical
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={`/user/${userId}/signout`}>
                Sign Out
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;
