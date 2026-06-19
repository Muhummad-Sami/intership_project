import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { getToken } from "../utils/auth";

export default function AdminPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login", { state: { from: { pathname: "/admin" } } });
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bRes, cRes] = await Promise.all([
        api.get("/bookings/all"),
        api.get("/cars"),
      ]);
      setBookings(bRes.data);
      setCars(cRes.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setMessage("⚠️ Admin access required. Please contact support.");
      } else {
        setMessage("Error loading data");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Toggle availability
  const toggleAvailability = async (carId, current) => {
    try {
      await api.patch(`/cars/${carId}/availability`, { available: !current });
      setMessage(`✅ Car ${!current ? "reserved" : "available"} successfully`);
      fetchData();
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update car availability");
    }
  };

  const handleConfirm = async (id) => {
    if (!window.confirm("Confirm this booking?")) return;
    try {
      await api.patch(`/bookings/confirm/${id}`);
      setMessage("✅ Booking confirmed and car reserved!");
      fetchData();
    } catch (err) {
      setMessage("❌ Error confirming booking");
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${id}`);
      setMessage("✅ Booking cancelled and car made available.");
      fetchData();
    } catch (err) {
      setMessage("❌ Error cancelling booking");
    }
  };

  if (loading) return <div style={{ paddingTop: 73, textAlign: "center" }}>Loading admin...</div>;

  return (
    <div style={{ paddingTop: 73, minHeight: "100vh", background: "var(--surface-container-lowest)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "30px 20px" }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif" }}>Admin Dashboard</h1>

        {message && (
          <div style={{
            padding: 12,
            borderRadius: 8,
            marginBottom: 20,
            background: message.includes("✅") ? "rgba(76,175,80,0.1)" : "rgba(244,67,54,0.1)",
            color: message.includes("✅") ? "#4CAF50" : "#f44336",
          }}>
            {message}
          </div>
        )}

        {/* Pending Requests */}
        <div style={{ background: "var(--surface)", padding: 20, borderRadius: 12, marginBottom: 40 }}>
          <h2>⏳ Pending Requests</h2>
          {bookings.filter(b => b.status === "pending").length === 0 ? (
            <p>No pending requests.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                    <th style={{ padding: 10, textAlign: "left" }}>Customer</th>
                    <th style={{ padding: 10, textAlign: "left" }}>Car</th>
                    <th style={{ padding: 10, textAlign: "left" }}>Dates</th>
                    <th style={{ padding: 10, textAlign: "left" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.filter(b => b.status === "pending").map(b => (
                    <tr key={b._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td>{b.user?.name}<div style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>{b.user?.email}</div></td>
                      <td>{b.carName}</td>
                      <td>{new Date(b.startDate).toLocaleDateString()} → {new Date(b.endDate).toLocaleDateString()}</td>
                      <td>
                        <button style={{ padding: "6px 16px", borderRadius: 4, background: "#4CAF50", color: "#fff", border: "none", cursor: "pointer", marginRight: 8 }} onClick={() => handleConfirm(b._id)}>✅ Confirm</button>
                        <button style={{ padding: "6px 16px", borderRadius: 4, background: "#f44336", color: "#fff", border: "none", cursor: "pointer" }} onClick={() => handleCancel(b._id)}>❌ Cancel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Manage Cars – with toggle buttons */}
        <div style={{ background: "var(--surface)", padding: 20, borderRadius: 12 }}>
          <h2>🚗 Manage Cars</h2>
          {cars.length === 0 ? (
            <p>No cars found in the database. Please seed cars.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cars.map(car => (
                <div
                  key={car._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.06)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {car.image && (
                      <img
                        src={car.image}
                        alt={car.name}
                        style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 600 }}>{car.name}</div>
                      <div style={{ fontSize: 14, color: "var(--on-surface-variant)" }}>
                        ${car.price}/day · {car.brand}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                        background: car.available ? "rgba(76,175,80,0.15)" : "rgba(244,67,54,0.15)",
                        color: car.available ? "#4CAF50" : "#f44336",
                      }}
                    >
                      {car.available ? "Available" : "Reserved"}
                    </span>
                    <button
                      onClick={() => toggleAvailability(car._id, car.available)}
                      style={{
                        padding: "6px 16px",
                        borderRadius: 4,
                        border: "none",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                        background: car.available ? "#f44336" : "#4CAF50",
                        color: "#fff",
                      }}
                    >
                      {car.available ? "Set Reserved" : "Set Available"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}