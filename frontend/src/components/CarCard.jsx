import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getToken } from "../utils/auth";

export default function CarCard({ car }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = getToken();

  const handleAction = (e) => {
    e?.stopPropagation?.();
    if (!token || !user) {
      // ✅ Redirect to login, preserving the intended page AND the car object
      navigate("/login", {
        state: {
          from: { pathname: `/car/${car.carId}`, state: { car } },
        },
      });
      return;
    }
    // ✅ Go to details with the car object in state
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
        <div style={{ position: "absolute", top: 16, left: 16 }}>
          <span className={car.available ? "badge-available" : "badge-unavailable"}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "currentColor",
                display: "inline-block",
                marginRight: 8,
              }}
            />
            {car.available ? "Available" : "Reserved"}
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