import React, { createContext, useContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setToken] = useState(null);
  const [authEmail, setEmail] = useState(null);

  const login = (authEmail, authToken) => {
    setEmail(authEmail);
    setToken(authToken);
  };

  const logout = () => {
    setEmail(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ authEmail, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
