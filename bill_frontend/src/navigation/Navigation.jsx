import { useEffect } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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

const LoadingScreen = () => (
  <div className="min-h-screen bg-ink-950 flex items-center justify-center text-gray-400">
    <span className="h-6 w-6 rounded-full border-2 border-brand-400 border-t-transparent animate-spin" />
  </div>
);

/** Requires any authenticated user */
const ProtectedRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!authenticated) return <Navigate to="/login" replace />;
  return children;
};

/** Requires authenticated Authority role */
const AuthorityRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();
  const { type } = UseRollBased();
  if (loading) return <LoadingScreen />;
  if (!authenticated || type !== "authority") return <Navigate to="/login" replace />;
  return children;
};

/** Requires authenticated Citizen role */
const CitizenRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();
  const { type } = UseRollBased();
  if (loading) return <LoadingScreen />;
  if (!authenticated || type !== "citizen") return <Navigate to="/login" replace />;
  return children;
};

// ─── Animated Routes (page transitions) ─────────────────────────────────────────
function AnimatedRoutes() {
  const location = useLocation();

  // smooth scroll-to-top on navigation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        <Routes location={location}>
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
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function Navigation() {
  return (
    <Router>
      <NavBar />
      <AnimatedRoutes />
      <Footer />
    </Router>
  );
}

export default Navigation;
