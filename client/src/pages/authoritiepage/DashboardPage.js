import React, { useEffect, useState } from "react";
import AuthNavBar from "../../components/authoritie/AuthNavBar";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const AuthDashboard = () => {
  const [sosData, setSosData] = useState([]);
  const [liveLocations, setLiveLocations] = useState({});
  const [vehiclePhotos, setVehiclePhotos] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch SOS data
    const fetchSosData = async () => {
      try {
        const response = await fetch(
          "http://localhost:8060/api/authoritie/sos",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch SOS data");
        }

        const data = await response.json();
        setSosData(data.data);
        fetchVehiclePhotos(data.data, token); // Fetch vehicle photos
      } catch (error) {
        console.error("Error fetching SOS data:", error);
      }
    };

    // Fetch live location updates every 15 seconds for each trip
    const fetchLiveLocations = () => {
      sosData.forEach((sos) => {
        const tripId = sos.trip._id;
        fetch(`http://localhost:8060/api/authoritie/livelocation/${tripId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((locationData) => {
            setLiveLocations((prevLocations) => ({
              ...prevLocations,
              [tripId]: locationData.location,
            }));
          })
          .catch((error) =>
            console.error("Error fetching live location:", error)
          );
      });
    };

    // Fetch photos for the vehicle (associated with the SOS)
    const fetchVehiclePhotos = async (sosData, token) => {
      const photoPromises = sosData.map((sos) =>
        fetch(
          `http://localhost:8060/api/authoritie/getphoto/${sos.userId._id}`, // Fixed path
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((response) => response.blob())
          .then((blob) => URL.createObjectURL(blob))
      );

      const photos = await Promise.all(photoPromises);
      const photosMap = sosData.reduce((map, sos, index) => {
        map[sos._id] = photos[index];
        return map;
      }, {});
      setVehiclePhotos(photosMap);
    };

    fetchSosData();
    const intervalId = setInterval(fetchLiveLocations, 30000);

    return () => clearInterval(intervalId);
  }, [sosData]);

  // Default Leaflet icon settings
  const customIcon = new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  return (
    <div>
      <AuthNavBar />
      <div className="sos-list" style={{ padding: "20px" }}>
        <h2>SOS Alerts</h2>
        {sosData.length === 0 ? (
          <p>No SOS alerts found.</p>
        ) : (
          sosData.map((sos) => {
            const liveLocation = sos.location || liveLocations[sos.trip._id];
            const user = sos.userId; // Access user details directly
            const medicals = user.medicals || {}; // User's medical info

            return (
              <div
                key={sos._id}
                className="sos-item"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "20px",
                  marginBottom: "20px",
                  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  maxWidth: "800px",
                  margin: "10px auto",
                }}
              >
                {/* Vehicle photo and SOS details */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={vehiclePhotos[sos._id]}
                    alt="Vehicle"
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "8px",
                      marginRight: "20px",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: "bold" }}>
                      <strong>From:</strong> {sos.from}
                    </p>
                    <p style={{ color: sos.status ? "green" : "red" }}>
                      <strong>Status:</strong>{" "}
                      {sos.status ? "Active" : "Inactive"}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(sos.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* User Information */}
                <div style={{ marginTop: "20px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>
                    User Information:
                  </h3>
                  <p>
                    <strong>Username:</strong> {user.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {user.phone}
                  </p>
                </div>

                {/* Medical Information */}
                <div style={{ marginTop: "20px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: "bold" }}>
                    Medical Info:
                  </h4>
                  <p>
                    <strong>Has Allergies:</strong>{" "}
                    {medicals.hasAllergies ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Has Pre-existing Conditions:</strong>{" "}
                    {medicals.hasPreExistingConditions ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Requires Regular Medication:</strong>{" "}
                    {medicals.requiresRegularMedication ? "Yes" : "No"}
                  </p>
                  <p>
                    <strong>Requires Emergency Treatment:</strong>{" "}
                    {medicals.requiresEmergencyTreatment ? "Yes" : "No"}
                  </p>
                </div>

                {/* Trip Details */}
                {sos.trip && (
                  <div style={{ marginTop: "20px" }}>
                    <h4 style={{ fontSize: "14px", fontWeight: "bold" }}>
                      Trip Details:
                    </h4>
                    <p>
                      <strong>Trip ID:</strong> {sos.trip._id}
                    </p>
                    <p>
                      <strong>startLocation:</strong>{" "}
                      {sos.trip.startLocation.latitude +
                        ", " +
                        sos.trip.startLocation.longitude}
                    </p>
                    <p>
                      <strong>endLocation:</strong>{" "}
                      {sos.trip.endLocation.latitude +
                        ", " +
                        sos.trip.endLocation.longitude}
                    </p>
                    <p>
                      <strong>intoxicated:</strong>{" "}
                      {sos.trip.currentstate.intoxicated ? "Yes" : "No"}
                    </p>
                    <p>
                      <strong>feelingUnwell:</strong>{" "}
                      {sos.trip.currentstate.feelingUnwell ? "Yes" : "No"}
                    </p>
                  </div>
                )}

                {/* Live Location Map */}
                <div style={{ marginTop: "20px", height: "300px" }}>
                  <MapContainer
                    center={[liveLocation.latitude, liveLocation.longitude]}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{
                      height: "100%",
                      width: "100%",
                      borderRadius: "8px",
                    }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker
                      position={[liveLocation.latitude, liveLocation.longitude]}
                      icon={customIcon}
                    >
                      <Popup>
                        Live Location
                        <br />
                        Lat: {liveLocation.latitude}, Long:{" "}
                        {liveLocation.longitude}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AuthDashboard;
