import { createContext, useContext, useState, useMemo } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Initialize state from localStorage to persist session
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [name, setName] = useState(() => localStorage.getItem("name"));
  
  // isAuthenticated is derived from the presence of the token
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  const login = (authToken, userName = "User") => {
    localStorage.setItem("token", authToken);
    localStorage.setItem("name", userName);
    
    setToken(authToken);
    setName(userName);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    
    setToken(null);
    setName(null);
    setIsAuthenticated(false);
  };

  // Memoize the value to prevent unnecessary re-renders of consuming components
  const value = useMemo(() => ({
    isAuthenticated,
    token,
    name,
    login,
    logout,
  }), [isAuthenticated, token, name]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to use the AuthContext.
 * Includes a safety check to ensure it's used within an AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined || context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}