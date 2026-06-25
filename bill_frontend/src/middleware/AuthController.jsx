import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/auth.api";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = localStorage.getItem("isauth");
    const savedUser = localStorage.getItem("user");
    
    if (checkAuth === "true" && savedUser) {
      setAuthenticated(true);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem("isauth", "true");
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
    }
    setAuthenticated(true);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      localStorage.removeItem("isauth");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("authorityToken");
      localStorage.removeItem("userRole"); // Clear persisted role for RBAC reset
      setAuthenticated(false);
      setUser(null);
      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider value={{ authenticated, user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within the AuthProvider");
  }
  return context;
};
