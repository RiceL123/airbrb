import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setToken] = useState(localStorage.getItem('authToken') || null);
  const [authEmail, setEmail] = useState(localStorage.getItem('authEmail') || null);

  const login = (authEmail, authToken) => {
    setEmail(authEmail);
    setToken(authToken);
  };

  useEffect(() => {
    if (authToken && authEmail) {
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('authEmail', authEmail);
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authEmail');
    }
  }, [authToken, authEmail]);

  const logout = () => {
    setEmail(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authEmail');
  };

  return (
    <AuthContext.Provider value={{ authEmail, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
