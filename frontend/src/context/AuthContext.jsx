import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, getUser, setToken, setUser, removeToken, removeUser } from "../utils/auth";

const AuthContext = createContext();

// ✅ Manual JWT decode – no external library needed
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  let refreshBookingsFn = null;
  let clearBookingsFn = null;

  const logout = () => {
    removeToken();
    removeUser();
    setUserState(null);
    if (clearBookingsFn) clearBookingsFn();
  };

  useEffect(() => {
    const token = getToken();
    const userData = getUser();

    if (token && userData) {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 < Date.now()) {
        logout();
      } else {
        setUserState(userData);
        if (refreshBookingsFn) refreshBookingsFn();
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    setUserState(userData);
    if (refreshBookingsFn) refreshBookingsFn();
  };

  const registerRefresh = (refreshFn, clearFn) => {
    refreshBookingsFn = refreshFn;
    clearBookingsFn = clearFn;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, registerRefresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);