// src/App.js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./components/Dashboard/Dashboard";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import FitnessTracker from "./components/Fitness/FitnessTracker";
import NutritionTracker from "./components/Nutrition/NutritionTracker";
import StressTracker from "./components/Stress/StressTracker";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/Footer/Footer";
import MyProfile from "./pages/myProfile";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import { ToastContainer } from "react-toastify";

// Admin components
import AdminLogin from './pages/adminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminList from './components/AdminList';
import AdminUserTable from './components/adminUserTable';
import AdminDashboard from "./pages/AdminDashboard";
import AdminForgotPassword from './pages/AdminForgotPassword';
import AdminResetPassword from './pages/AdminResetPassword';
import Emotion from "./pages/Emotion";
import LandingPage from "./pages/Landingpage";
// ✅ User forgot/reset components directly from `pages/`
import UserForgotPassword from './pages/UserForgotPassword';
import UserResetPassword from './pages/UserResetPassword';

export default function App() {
  const { isLoggedIn } = useContext(AppContext);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <Routes>

          {/* ===== Admin Routes ===== */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />

          {/* ✅ User forgot/reset password pages */}
          <Route path="/forgot-password" element={<UserForgotPassword />} />
          <Route path="/reset-password" element={<UserResetPassword />} />

          {/* ===== User Routes (based on login) ===== */}
          {isLoggedIn ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/fitness" element={<FitnessTracker />} />
              <Route path="/nutrition" element={<NutritionTracker />} />
              <Route path="/stress" element={<StressTracker />} />
              <Route path="/my-profile" element={<MyProfile />} />
              <Route path="/emotion" element={<Emotion />} />
            </>
          ) : (
            <>
            <Route path="/" element={<LandingPage />} />
             
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Login />} />
              <Route path="/fitness" element={<Login />} />
              <Route path="/nutrition" element={<Login />} />
              <Route path="/stress" element={<Login />} />
            </>
          )}

        </Routes>

        {isLoggedIn && <Footer />}
        <ToastContainer />
      </div>
    </BrowserRouter>
  );
}
