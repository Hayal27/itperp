import React, { createContext, useState, useContext } from "react";

// Create the GlobalContext
const GlobalContext = createContext();

// Provider component that wraps your app and makes the context available to all components
export const GlobalProvider = ({ children }) => {
  // You can define the state that you want to be available globally here
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setTheme] = useState("light");

  // A function to update the user state (you can expand this as needed)
  const loginUser = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logoutUser = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <GlobalContext.Provider
      value={{
        user,
        isAuthenticated,
        theme,
        loginUser,
        logoutUser,
        toggleTheme,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Custom hook to use the global context
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
