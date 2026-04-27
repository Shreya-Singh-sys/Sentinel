import { Routes, Route } from "react-router-dom";
import Splash from "./pages/slash.tsx"; // Path check kar lena
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StaffDashboard from "./pages/StaffDashboard";
import GuestDashboard from "./pages/GuestDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SafetyMap from "./pages/SafetyMap";
import Profile from "./pages/Profile";
import Emergency from "./pages/Emergency";
import StaffProfile from "./pages/StaffProfile";
import AdminProfile from "./pages/AdminProfile";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/staff-dashboard" element={<StaffDashboard />} />
      <Route path="/guest-dashboard" element={<GuestDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      
      <Route path="/safety-map" element={<SafetyMap />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/emergency" element={<Emergency />} />
      <Route path="/staff-profile" element={<StaffProfile />} />
      <Route path="/admin-profile" element={<AdminProfile />} />
      {/* <Route path="/responder" element={<ResponderView />} /> */}
      // App.jsx mein ye change kijiye
      <Route path="/responder" element={<Emergency />} />
    </Routes>
  );
}

export default App;