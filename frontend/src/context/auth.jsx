import { useState, useMemo } from "react";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [name, setName] = useState(() => localStorage.getItem("name"));

  // Derived — always in sync with token, no manual syncing needed
  const isAuthenticated = !!token;

  const login = (authToken, userName = "User") => {
    localStorage.setItem("token", authToken);
    localStorage.setItem("name", userName);
    setToken(authToken);
    setName(userName);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    setToken(null);
    setName(null);
  };

  const value = useMemo(
    () => ({ isAuthenticated, token, name, login, logout }),
    [isAuthenticated, token, name]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
