import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getToken } from "../utils/auth";

export default function CarCard({ car }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = getToken();

  // ✅ Determine status text and color based on availability
  const isAvailable = car.available ?? true;
  const statusText = isAvailable ? "Available Today" : "Reserved";
  const statusColor = isAvailable ? "#4CAF50" : "#f44336";

  const handleAction = (e) => {
    e?.stopPropagation?.();
    if (!token || !user) {
      navigate("/login", {
        state: {
          from: { pathname: `/car/${car.carId}`, state: { car } },
        },
      });
      return;
    }
    navigate(`/car/${car.carId}`, { state: { car } });
  };

  return (
    <div className="car-card" onClick={handleAction}>
      <div className="card-img-wrapper">
        <img src={car.image} alt={car.name} loading="lazy" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(18,20,20,0.85), transparent)",
          }}
        />

        {/* ✅ NEW Availability Status Badge */}
        <div style={{ position: "absolute", top: 16, left: 16 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: 20,
              fontSize: 10,
              fontWeight: 600,
              background: isAvailable
                ? "rgba(76,175,80,0.15)"
                : "rgba(244,67,54,0.15)",
              color: statusColor,
              border: `1px solid ${statusColor}33`,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: statusColor,
                display: "inline-block",
              }}
            />
            {statusText}
          </span>
        </div>

        <div style={{ position: "absolute", top: 12, right: 12 }}>
          <span
            className="label-caps"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              padding: "5px 12px",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "var(--on-surface-variant)",
            }}
          >
            {car.category}
          </span>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h3
              style={{
                fontFamily: "Playfair Display",
                fontSize: 22,
                color: "var(--on-surface)",
                marginBottom: 4,
              }}
            >
              {car.name}
            </h3>
            <p style={{ color: "var(--on-surface-variant)", fontSize: 14 }}>
              {car.brand} · {car.subtitle}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/car/${car.carId}`, { state: { car } });
            }}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1px solid rgba(212,175,55,0.3)",
              background: "transparent",
              color: "var(--gold)",
              cursor: "pointer",
            }}
          >
            →
          </button>
        </div>

        <div
          style={{
            display: "flex",
            gap: 25,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            marginTop: 20,
            paddingTop: 16,
          }}
        >
          <div>
            <span className="label-caps">0-60</span>
            <p>{car.acceleration}</p>
          </div>
          <div>
            <span className="label-caps">Power</span>
            <p>{car.power}</p>
          </div>
          <div style={{ marginLeft: "auto", textAlign: "right" }}>
            <span className="label-caps">Per Day</span>
            <p style={{ color: "var(--gold)", fontSize: 20, fontWeight: 700 }}>
              ${car.price}
            </p>
          </div>
        </div>

        <button className="btn-primary" onClick={handleAction}>
          Reserve Now
        </button>
      </div>
    </div>
  );
}