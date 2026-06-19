import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BookingProvider, useBooking } from "./context/BookingContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import HomePage from "./pages/HomePage";
import CarsPage from "./pages/CarsPage";
import CarDetailsPage from "./pages/CarDetailsPage";
import BookingPage from "./pages/BookingPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

function ContextConnector({ children }) {
  const { registerRefresh } = useAuth();
  const { refreshBookings, clearBookings } = useBooking();

  React.useEffect(() => {
    registerRefresh(refreshBookings, clearBookings);
  }, [registerRefresh, refreshBookings, clearBookings]);

  return children;
}

function AppLayout() {
  const location = useLocation();
  const noLayout = location.pathname === "/login" || location.pathname === "/admin";
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {!noLayout && <Navbar />}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars" element={<CarsPage />} />
          <Route path="/car/:id" element={<CarDetailsPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      {!noLayout && <Footer />}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <ContextConnector>
            <AppLayout />
          </ContextConnector>
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}