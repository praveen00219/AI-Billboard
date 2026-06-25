import { Menu, Moon, Shield, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGetAuthorityInfo } from "../hooks/Authority/GetAuthorityInfo";
import { useGetCitizenInfo } from "../hooks/Citizen/CitizenInfo";
import { useAuth } from "../middleware/AuthController";
import { UseRollBased } from "../middleware/RollBasedAccessController";

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
          { name: "DashBoard", href: "/citizen-dashboard" },
          { name: "HeatMap", href: "/heatmap" },
        ]
      : [{ name: "Authority Dashboard", href: "/authority-dash" }]
    : [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
      ];

  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    if (!authenticated) return;
    if (type === "citizen") {
      getCitizenData();
    } else if (type === "authority") {
      getAuthorityData();
    }
  }, [authenticated, type]);

  const displayUser =
    type === "authority"
      ? authorityLoading
        ? "Loading Authority..."
        : authority?.name || authority?.email || "Authority"
      : citizenLoading
      ? "Loading Citizen..."
      : citizen?.name || citizen?.email || "Citizen";

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600/20 to-purple-600/20 border border-white/10 group-hover:border-white/20 transition-colors">
              <Shield className="h-6 w-6 text-blue-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-all">
              Billboard<span className="text-blue-500">Watch</span>
            </span>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-semibold tracking-wide transition-all duration-300 hover:-translate-y-0.5 ${
                  location.pathname === item.href
                    ? "text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]"
                    : "text-gray-400 hover:text-gray-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              {authenticated ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-medium text-gray-300">
                      {displayUser}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="px-5 py-2 text-sm font-bold text-gray-300 hover:text-white transition-all duration-200 border border-white/10 rounded-full hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2 text-sm font-bold text-gray-300 hover:text-white transition-all duration-200 hover:bg-white/5 rounded-full"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)] hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-full hover:bg-white/10 transition-colors duration-200 border border-white/10"
            >
              <Menu className="h-5 w-5 text-gray-300" />
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <div className="md:hidden px-4 pb-6 pt-2 space-y-3 bg-[#0A0A0A]/95 border-t border-white/5 absolute top-20 left-0 w-full shadow-2xl backdrop-blur-2xl">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={`block text-base font-semibold px-4 py-3 rounded-xl transition-colors duration-200 ${
                  location.pathname === item.href
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-4"></div>

            {authenticated ? (
              <div className="space-y-3 px-4">
                <div className="flex items-center gap-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="block text-sm font-medium text-gray-300">
                    {displayUser}
                  </span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-sm font-bold text-red-400 hover:text-red-300 transition-colors duration-200 border border-red-500/20 rounded-xl bg-red-500/10"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-3 px-4">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-3 text-center text-sm font-bold text-white transition-colors duration-200 border border-white/10 rounded-xl bg-white/5"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors duration-200 text-center shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
