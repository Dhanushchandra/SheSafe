import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import "./App.css";
import SignUpPage from "./pages/userpage/SignupPage";
import LoginPage from "./pages/userpage/LoginPage";
import UserDashBoard from "./pages/userpage/UserDashBoard";
import ContactsPage from "./pages/userpage/ContactsPage";
import UserProfile from "./pages/userpage/ProfilePage";
import MedicalPage from "./pages/userpage/Medical";
import StartTrip from "./pages/userpage/StartTrip";
import AuthLoginPage from "./pages/authoritiepage/AuthLoginPage";
import AuthDashboard from "./pages/authoritiepage/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/abc" element={<></>}>
          <Route path="*" element={<p>Not Found</p>} />
        </Route> */}
        <Route path="/user/signup" element={<SignUpPage />} />
        <Route path="/user/login" element={<LoginPage />} />
        <Route path="/user/:userId/dashboard" element={<UserDashBoard />} />
        <Route path="/user/:userId/contacts" element={<ContactsPage />} />
        <Route path="/user/:userId/profile" element={<UserProfile />} />
        <Route path="/user/:userId/medical" element={<MedicalPage />} />
        <Route path="/user/:userId/tripstart" element={<StartTrip />} />
        {/* ---------------------- */}
        <Route path="/authoritie/login" element={<AuthLoginPage />} />
        <Route
          path="/authoritie/:userId/dashboard"
          element={<AuthDashboard />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
