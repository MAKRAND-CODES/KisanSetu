import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

import Login from "../pages/Login";
import Register from "../pages/Register";

import FarmerDashboard from "../pages/farmer/FarmerDashboard";
import MyFarm from "../pages/farmer/MyFarm";
import CropRecommendation from "../pages/farmer/CropRecommendation";
import FertilizerGuide from "../pages/farmer/FertilizerGuide";
import MyComplaints from "../pages/farmer/MyComplaints";
import InsurancePortal from "../pages/farmer/InsurancePortal";
import GovernmentSchemes from "../pages/farmer/GovernmentSchemes";
import MarketPrices from "../pages/farmer/MarketPrices";
import SatelliteFarmView from "../pages/farmer/SatelliteFarmView";
import WeatherCenter from "../pages/farmer/WeatherCenter";
import Notifications from "../pages/farmer/Notifications";

import OfficerDashboard from "../pages/officer/OfficerDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import LandingPage from "../pages/LandingPage";
const FarmerOnly = ({ children }) => (
  <ProtectedRoute allowedRoles={["farmer"]}>{children}</ProtectedRoute>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/farmer/dashboard" element={<FarmerOnly><FarmerDashboard /></FarmerOnly>} />
      <Route path="/farmer/farms" element={<FarmerOnly><MyFarm /></FarmerOnly>} />
      <Route path="/farmer/crops" element={<FarmerOnly><CropRecommendation /></FarmerOnly>} />
      <Route path="/farmer/fertilizer" element={<FarmerOnly><FertilizerGuide /></FarmerOnly>} />
      <Route path="/farmer/complaints" element={<FarmerOnly><MyComplaints /></FarmerOnly>} />
      <Route path="/farmer/insurance" element={<FarmerOnly><InsurancePortal /></FarmerOnly>} />
      <Route path="/farmer/schemes" element={<FarmerOnly><GovernmentSchemes /></FarmerOnly>} />
      <Route path="/farmer/market" element={<FarmerOnly><MarketPrices /></FarmerOnly>} />
      <Route path="/farmer/satellite" element={<FarmerOnly><SatelliteFarmView /></FarmerOnly>} />
      <Route path="/farmer/weather" element={<FarmerOnly><WeatherCenter /></FarmerOnly>} />
      <Route path="/farmer/notifications" element={<FarmerOnly><Notifications /></FarmerOnly>} />

      <Route
        path="/officer/dashboard"
        element={
          <ProtectedRoute allowedRoles={["officer"]}>
            <OfficerDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;