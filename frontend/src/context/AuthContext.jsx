import React, { createContext, useContext, useState, useEffect } from "react";
import { getToken, getUser, setToken, setUser, removeToken, removeUser } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // These will be set by ContextConnector later
  let refreshBookingsFn = null;
  let clearBookingsFn = null;

  const registerRefresh = (refreshFn, clearFn) => {
    refreshBookingsFn = refreshFn;
    clearBookingsFn = clearFn;
  };

  useEffect(() => {
    const token = getToken();
    const userData = getUser();
    if (token && userData) {
      setUserState(userData);
      if (refreshBookingsFn) refreshBookingsFn();
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    setToken(token);
    setUser(userData);
    setUserState(userData);
    if (refreshBookingsFn) refreshBookingsFn();
  };

  const logout = () => {
    removeToken();
    removeUser();
    setUserState(null);
    if (clearBookingsFn) clearBookingsFn();
    if (refreshBookingsFn) refreshBookingsFn(); // fetches with no token → clears bookings
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, registerRefresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);