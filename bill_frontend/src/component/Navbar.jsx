import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Logo from "./brand/Logo";
import { useGetAuthorityInfo } from "../hooks/Authority/GetAuthorityInfo";
import { useGetCitizenInfo } from "../hooks/Citizen/CitizenInfo";
import { useAuth } from "../middleware/AuthController";
import { UseRollBased } from "../middleware/RollBasedAccessController";
import { useEffect } from "react";

export default function NavBar() {
  const { type } = UseRollBased(); // citizen ya authority
  const { authenticated, logout } = useAuth();

  const {
    getTheData: getAuthorityData,
    authority,
    loading: authorityLoading,
  } = useGetAuthorityInfo();

  const {
    getCitizenData,
    citizen,
    loading: citizenLoading,
  } = useGetCitizenInfo();

  const navigation = authenticated
    ? type === "citizen"
      ? [
          { name: "Dashboard", href: "/citizen-dashboard" },
          { name: "HeatMap", href: "/heatmap" },
        ]
      : [{ name: "Authority Dashboard", href: "/authority-dash" }]
    : [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
      ];

  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!authenticated) return;
    if (type === "citizen") {
      getCitizenData();
    } else if (type === "authority") {
      getAuthorityData();
    }
  }, [authenticated, type]);

  // close mobile menu on route change
  useEffect(() => setIsOpen(false), [location.pathname]);

  const displayUser =
    type === "authority"
      ? authorityLoading
        ? "Loading Authority..."
        : authority?.name || authority?.email || "Authority"
      : citizenLoading
      ? "Loading Citizen..."
      : citizen?.name || citizen?.email || "Citizen";

  return (
    <nav className="sticky top-0 z-50 w-full glass-strong border-b border-white/[0.06]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="group flex items-center transition-transform duration-200 hover:scale-[1.02]">
            <Logo size={32} />
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative py-2 text-sm font-medium transition-colors"
                >
                  <span className={active ? "text-white" : "text-gray-400 hover:text-gray-100"}>
                    {item.name}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-0.5 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-brand-400 to-accent-400"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              {authenticated ? (
                <>
                  <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <span className="text-sm font-medium text-gray-300 max-w-[160px] truncate">
                      {displayUser}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-5 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-all duration-200 border border-white/10 rounded-full hover:bg-white/10"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors rounded-full hover:bg-white/5"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2.5 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 shadow-[0_8px_26px_-8px_rgba(100,87,243,0.7)] transition-all duration-200 hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsOpen((v) => !v)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors border border-white/10"
            >
              {isOpen ? <X className="h-5 w-5 text-gray-200" /> : <Menu className="h-5 w-5 text-gray-200" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden glass-strong border-t border-white/5 px-4 pb-6 pt-3 space-y-2"
          >
            {navigation.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block text-base font-medium px-4 py-3 rounded-xl transition-colors ${
                    active
                      ? "bg-brand-500/15 text-brand-200 border border-brand-500/25"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-3" />

            {authenticated ? (
              <div className="space-y-3 px-1">
                <div className="flex items-center gap-2 px-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-gray-300 truncate">{displayUser}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-sm font-semibold text-rose-300 hover:text-rose-200 transition-colors border border-rose-500/20 rounded-xl bg-rose-500/10"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3 px-1">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-3 text-center text-sm font-semibold text-white transition-colors border border-white/10 rounded-xl bg-white/5 hover:bg-white/10"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-3 text-center text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-brand-600 to-brand-500"
                >
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
