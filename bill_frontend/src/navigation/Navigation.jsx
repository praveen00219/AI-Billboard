import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ParticularReports from "../component/AuthorityDashComp/ParticularReports";
import ShowingPendingReports from "../component/AuthorityDashComp/ShowingPendingReports";
import Footer from "../component/Footer";
import NavBar from "../component/Navbar";
import About from "../pages/About";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import AuthorityDashboard from "../pages/DashBoard/AuthorityDashboard";
import CitizenDashboard from "../pages/DashBoard/CitizenDashboard";
import HeatMapPage from "../pages/HeatMap/HeatMapPage";
import Home from "../pages/Home";
import ReportDetails from "../pages/Report/ReportDetails";
import NotFound from "../pages/NotFound";
import { useAuth } from "../middleware/AuthController";
import { UseRollBased } from "../middleware/RollBasedAccessController";

// ─── Route Guards ─────────────────────────────────────────────────────────────

/** Requires any authenticated user */
const ProtectedRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-gray-400">Loading...</div>;
  if (!authenticated) return <Navigate to="/login" replace />;
  return children;
};

/** Requires authenticated Authority role */
const AuthorityRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();
  const { type } = UseRollBased();
  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-gray-400">Loading...</div>;
  if (!authenticated || type !== "authority") return <Navigate to="/login" replace />;
  return children;
};

/** Requires authenticated Citizen role */
const CitizenRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();
  const { type } = UseRollBased();
  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-gray-400">Loading...</div>;
  if (!authenticated || type !== "citizen") return <Navigate to="/login" replace />;
  return children;
};

// ─── Navigation ───────────────────────────────────────────────────────────────
function Navigation() {
  return (
    <Router>
      <NavBar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/heatmap" element={<HeatMapPage />} />

        {/* Citizen-Only Routes */}
        <Route
          path="/citizen-dashboard"
          element={<CitizenRoute><CitizenDashboard /></CitizenRoute>}
        />

        {/* Authority-Only Routes */}
        <Route
          path="/authority-dash"
          element={<AuthorityRoute><AuthorityDashboard /></AuthorityRoute>}
        />
        <Route
          path="/pending-citizen-reports"
          element={<AuthorityRoute><ShowingPendingReports /></AuthorityRoute>}
        />
        <Route
          path="/reports/:citizenId"
          element={<AuthorityRoute><ParticularReports /></AuthorityRoute>}
        />

        {/* Protected (any authenticated user) */}
        <Route
          path="/report-deatils/:reportId"
          element={<ProtectedRoute><ReportDetails /></ProtectedRoute>}
        />

        {/* Catch-all Route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default Navigation;
