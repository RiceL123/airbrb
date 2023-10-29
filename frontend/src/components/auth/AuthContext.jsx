import React, { createContext, useContext, useState } from 'react';

// Create the AuthContext
export const AuthContext = createContext();

// Create an AuthProvider component to wrap your entire application
export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  // Define a function to handle user login
  const login = (token) => {
    setAuthToken(token);
  };

  // Define a function to handle user logout
  const logout = () => {
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to access the authentication context
export const useAuth = () => useContext(AuthContext);
