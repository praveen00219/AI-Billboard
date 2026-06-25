import { createContext, useCallback, useContext, useState } from "react";

const RoleContext = createContext(undefined);

/**
 * RollbasedProvider - Persists the user role (citizen/authority) to localStorage
 * so it survives page refreshes. This is the source of truth for RBAC on the frontend.
 */
export const RollbasedProvider = ({ children }) => {
  // Initialize from localStorage so role persists across refreshes
  const [type, setTypeState] = useState(
    () => localStorage.getItem("userRole") || "citizen"
  );

  const setType = useCallback((newType) => {
    localStorage.setItem("userRole", newType);
    setTypeState(newType);
  }, []);

  return (
    <RoleContext.Provider value={{ type, setType }}>
      {children}
    </RoleContext.Provider>
  );
};

export const UseRollBased = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("UseRollBased must be used within RollbasedProvider");
  }
  return context;
};
