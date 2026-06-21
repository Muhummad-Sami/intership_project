import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { getToken } from "../utils/auth";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const refreshBookings = async () => {
    const token = getToken();
    if (!token) {
      setBookings([]);
      setLoading(false);
      return;
    }
    try {
      const res = await api.get("/bookings");
      const formatted = res.data.map((b) => ({
        id: b._id,
        car: b.car,
        pickupDate: b.startDate ? new Date(b.startDate).toISOString().split("T")[0] : "",
        returnDate: b.endDate ? new Date(b.endDate).toISOString().split("T")[0] : "",
        status: b.status || "pending",
        pickupLocation: b.pickupLocation || "",
        dropoffLocation: b.dropoffLocation || "",
        specialRequests: b.specialRequests || "",
        passengers: b.passengers || 1,
        chauffeur: false,
        fuel: false,
      }));
      setBookings(formatted);
    } catch (err) {
      console.error("Refresh bookings error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Accept full payload
  const addBooking = async (payload, isRequest = true) => {
    const token = getToken();
    if (!token) {
      showToast("Please login first", "error");
      return false;
    }
    try {
      const { car, startDate, endDate, pickupLocation, dropoffLocation, specialRequests, passengers, timezone } = payload;
      const endpoint = isRequest ? "/bookings/request" : "/bookings";

      // ✅ Ensure we send a valid carId with fallback
      const carId = String(car.carId || car.id || car._id);

      const res = await api.post(endpoint, {
        carId: carId,
        carName: car.name,
        car: car,
        startDate,
        endDate,
        pickupLocation,
        dropoffLocation,
        specialRequests,
        passengers,
        timezone,
      });

      const newBooking = {
        id: res.data.booking._id,
        car: car,
        pickupDate: new Date(startDate).toISOString().split("T")[0],
        returnDate: new Date(endDate).toISOString().split("T")[0],
        status: res.data.booking.status || "pending",
        pickupLocation: pickupLocation || "",
        dropoffLocation: dropoffLocation || "",
        specialRequests: specialRequests || "",
        passengers: passengers || 1,
        chauffeur: false,
        fuel: false,
      };

      setBookings((prev) => [...prev, newBooking]);
      showToast(isRequest ? "📩 Booking request sent! Admin will review." : "Car reserved!", "success");
      return true;
    } catch (err) {
      console.error("❌ Booking error:", err.response?.data || err.message);
      showToast(err.response?.data?.message || "Booking failed", "error");
      return false;
    }
  };

  const removeBooking = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b.id !== id));
      showToast("Booking removed", "info");
    } catch (err) {
      showToast("Failed to remove", "error");
    }
  };

  const updateDates = (id, pickup, ret) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, pickupDate: pickup, returnDate: ret } : b))
    );
  };

  const updateOptions = (id, options) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...options } : b))
    );
  };

  const getDays = (pickup, ret) => {
    if (!pickup || !ret) return 1;
    const diff = new Date(ret) - new Date(pickup);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const calculateTotal = () => {
    return bookings.reduce((sum, b) => {
      const days = getDays(b.pickupDate, b.returnDate);
      let price = (b.car?.price || 0) * days;
      if (b.chauffeur) price += 500 * days;
      if (b.fuel) price += 150;
      return sum + price;
    }, 0);
  };

  const clearBookings = () => setBookings([]);

  return (
    <BookingContext.Provider
      value={{
        bookings,
        loading,
        addBooking,
        removeBooking,
        updateDates,
        updateOptions,
        calculateTotal,
        getDays,
        clearBookings,
        refreshBookings,
        toast,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);