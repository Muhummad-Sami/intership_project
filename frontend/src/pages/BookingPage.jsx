import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";

export default function BookingPage() {
  const navigate = useNavigate();
  const { bookings, removeBooking, updateDates, updateOptions, calculateTotal, getDays, clearBookings } = useBooking();
  const [confirmed, setConfirmed] = useState(false);

  const total = calculateTotal();
  const taxes = Math.round(total * 0.12);
  const deposit = bookings.reduce((s, b) => s + (b.car?.deposit || 0), 0);
  const grandTotal = total + taxes + deposit;

  const handleConfirm = () => {
    setConfirmed(true);
    clearBookings();
  };

  if (confirmed) {
    return (
      <div style={{ paddingTop: 73, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 20px" }}>
        <div style={{ textAlign: "center", padding: "40px 20px", maxWidth: 600 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(212,175,55,0.1)", border: "2px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 36, color: "var(--gold)" }}>check</span>
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(28px, 6vw, 40px)", color: "var(--on-surface)", marginBottom: 16 }}>Reservation Confirmed</h1>
          <p style={{ color: "var(--on-surface-variant)", fontSize: "clamp(16px, 2vw, 18px)", marginBottom: 36 }}>Your vehicles have been reserved. Our concierge will contact you shortly.</p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => navigate("/")}>Return Home</button>
            <button className="btn-secondary" onClick={() => navigate("/cars")}>Browse More</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 73, minHeight: "100vh" }}>
      <div style={{ background: "var(--surface-container-lowest)", padding: "clamp(30px, 5vw, 60px) clamp(16px, 4vw, 80px) clamp(24px, 4vw, 48px)" }}>
        <div className="container" style={{ padding: 0, maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", maxWidth: 480, marginBottom: 40, flexWrap: "wrap" }}>
            {[["DATES", true], ["DETAILS", true], ["PAYMENT", false]].map(([label, active], i) => (
              <React.Fragment key={label}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div className={`stepper-dot ${active ? "active" : ""}`} />
                  <span className="label-caps" style={{ color: active ? "var(--gold)" : "var(--on-surface-variant)", marginTop: 6, fontSize: 9 }}>{label}</span>
                </div>
                {i < 2 && <div className={`stepper-line ${active && i === 0 ? "active" : ""}`} key={`line-${i}`} />}
              </React.Fragment>
            ))}
          </div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px, 5vw, 48px)", fontWeight: 600, color: "var(--on-surface)" }}>Your Reservations</h1>
          <p style={{ color: "var(--on-surface-variant)", marginTop: 8, fontSize: "clamp(14px, 1.5vw, 16px)" }}>{bookings.length} vehicle{bookings.length !== 1 ? "s" : ""} in your reservation</p>
        </div>
      </div>

      <div className="container" style={{ padding: "clamp(24px, 4vw, 48px) clamp(16px, 4vw, 40px) 96px", maxWidth: 1400, margin: "0 auto" }}>
        {bookings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <span className="material-symbols-outlined" style={{ fontSize: 64, color: "var(--outline)", display: "block", marginBottom: 20 }}>luggage</span>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px, 4vw, 28px)", color: "var(--on-surface)", marginBottom: 12 }}>No reservations yet</h3>
            <p style={{ color: "var(--on-surface-variant)", marginBottom: 32, fontSize: "clamp(14px, 1.5vw, 16px)" }}>Browse our fleet and reserve your dream vehicle.</p>
            <button className="btn-primary" onClick={() => navigate("/cars")}>Explore Fleet</button>
          </div>
        ) : (
          <div className="booking-grid">
            <div className="booking-list">
              {bookings.map(b => {
                if (!b.car) {
                  return (
                    <div key={b.id} className="glass" style={{ padding: 20, borderRadius: 12 }}>
                      <p style={{ color: "var(--on-surface-variant)" }}>Car details not available.</p>
                      <button onClick={() => b.id && removeBooking(b.id)} style={{ background: "none", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 4, color: "#ff6b6b", cursor: "pointer", padding: "6px 12px", marginTop: 12 }}>Remove</button>
                    </div>
                  );
                }

                const days = getDays(b.pickupDate, b.returnDate);
                let lineTotal = (b.car.price || 0) * days;
                if (b.chauffeur) lineTotal += 500 * days;
                if (b.fuel) lineTotal += 150;

                const statusColors = {
                  pending: { bg: "#ff9800", label: "PENDING" },
                  confirmed: { bg: "#4CAF50", label: "CONFIRMED" },
                  cancelled: { bg: "#f44336", label: "CANCELLED" },
                };
                const s = statusColors[b.status] || statusColors.pending;

                return (
                  <div key={b.id} className="glass" style={{ borderRadius: 12, overflow: "hidden", position: "relative" }}>
                    <div style={{ position: "absolute", top: 12, right: 12, zIndex: 10, padding: "4px 12px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", background: s.bg, color: "#fff", textTransform: "uppercase" }}>
                      {s.label}
                    </div>
                    <div style={{ height: "clamp(160px, 30vh, 200px)", position: "relative", overflow: "hidden" }}>
                      <img src={b.car.image || "https://via.placeholder.com/800x400/222/666?text=No+Image"} alt={b.car.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(18,20,20,0.9) 0%, transparent 60%)" }} />
                      <div style={{ position: "absolute", bottom: 0, left: 0, padding: "clamp(12px, 2vw, 20px) clamp(16px, 2vw, 24px)", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                          <div className="label-caps" style={{ color: "var(--gold)", marginBottom: 4, fontSize: "clamp(10px, 1vw, 12px)" }}>{b.car.brand}</div>
                          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "#fff" }}>{b.car.name}</h3>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div className="label-caps" style={{ color: "var(--on-surface-variant)", marginBottom: 4, fontSize: "clamp(8px, 1vw, 10px)" }}>Daily Rate</div>
                          <div style={{ color: "var(--gold)", fontSize: "clamp(16px, 2vw, 20px)", fontWeight: 700 }}>${(b.car.price || 0).toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-around", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px", background: "rgba(15,11,6,0.3)", flexWrap: "wrap" }}>
                      {[["speed", b.car.power || "N/A"], ["timer", b.car.acceleration || "N/A"], ["settings", b.car.transmission || "N/A"]].map(([icon, val]) => (
                        <div key={icon} style={{ textAlign: "center", minWidth: 60 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: "clamp(16px, 1.5vw, 18px)", color: "var(--on-surface-variant)", display: "block", marginBottom: 4 }}>{icon}</span>
                          <span className="label-caps" style={{ color: "var(--on-surface)", fontSize: "clamp(8px, 0.8vw, 10px)" }}>{val}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding: "clamp(16px, 2vw, 24px)", display: "flex", flexDirection: "column", gap: "clamp(16px, 2vw, 20px)" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(12px, 1.5vw, 20px)" }}>
                        <div>
                          <label className="label-caps" style={{ color: "var(--on-surface-variant)", display: "block", marginBottom: 8, fontSize: "clamp(8px, 0.8vw, 10px)" }}>Pickup Date</label>
                          <input type="date" className="luxury-input" value={b.pickupDate || ""} onChange={e => updateDates(b.id, e.target.value, b.returnDate)} min={new Date().toISOString().split("T")[0]} style={{ width: "100%" }} />
                        </div>
                        <div>
                          <label className="label-caps" style={{ color: "var(--on-surface-variant)", display: "block", marginBottom: 8, fontSize: "clamp(8px, 0.8vw, 10px)" }}>Return Date</label>
                          <input type="date" className="luxury-input" value={b.returnDate || ""} onChange={e => updateDates(b.id, b.pickupDate, e.target.value)} min={b.pickupDate || new Date().toISOString().split("T")[0]} style={{ width: "100%" }} />
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {[{ key: "chauffeur", label: "Chauffeur Service", desc: "Professional driver", price: "+$500/day" }, { key: "fuel", label: "Pre-paid Fuel", desc: "Return without refueling", price: "+$150" }].map(opt => (
                          <label key={opt.key} style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer", padding: "clamp(10px, 1.5vw, 16px) clamp(12px, 1.5vw, 16px)", borderRadius: 6, background: b[opt.key] ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.02)", border: `1px solid ${b[opt.key] ? "rgba(212,175,55,0.2)" : "rgba(255,255,255,0.06)"}`, flexWrap: "wrap" }}>
                            <input type="checkbox" checked={b[opt.key] || false} onChange={e => updateOptions(b.id, { [opt.key]: e.target.checked })} style={{ accentColor: "var(--gold)", width: 16, height: 16, flexShrink: 0 }} />
                            <div style={{ flex: 1, minWidth: 120 }}>
                              <div style={{ color: "var(--on-surface)", fontSize: "clamp(14px, 1.2vw, 15px)", fontWeight: 500 }}>{opt.label}</div>
                              <div style={{ color: "var(--on-surface-variant)", fontSize: "clamp(12px, 1vw, 13px)", marginTop: 2 }}>{opt.desc}</div>
                            </div>
                            <span style={{ color: "var(--gold)", fontSize: "clamp(12px, 1vw, 14px)", fontWeight: 600, whiteSpace: "nowrap" }}>{opt.price}</span>
                          </label>
                        ))}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.07)", flexWrap: "wrap", gap: 12 }}>
                        <div>
                          <span style={{ color: "var(--on-surface-variant)", fontSize: "clamp(12px, 1vw, 13px)" }}>{days || 1} day{days > 1 ? "s" : ""}</span>
                          <span style={{ color: "var(--gold)", fontSize: "clamp(18px, 2vw, 22px)", fontWeight: 700, marginLeft: 16 }}>${(lineTotal || 0).toLocaleString()}</span>
                        </div>
                        <button onClick={() => removeBooking(b.id)} style={{ background: "none", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 4, color: "#ff6b6b", cursor: "pointer", padding: "6px 12px", fontSize: "clamp(10px, 0.8vw, 12px)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="booking-summary" style={{ position: "sticky", top: 100 }}>
              <div className="glass-light" style={{ borderRadius: 12, overflow: "hidden" }}>
                {bookings.length > 0 && bookings[0]?.car && (
                  <div style={{ height: "clamp(120px, 20vh, 180px)", position: "relative", overflow: "hidden" }}>
                    <img src={bookings[0].car.image || "https://via.placeholder.com/800x400/222/666?text=No+Image"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(18,20,20,1) 0%, rgba(18,20,20,0.4) 100%)" }} />
                    <div style={{ position: "absolute", bottom: 16, left: 20 }}>
                      <div className="label-caps" style={{ color: "var(--gold)", fontSize: "clamp(8px, 0.8vw, 10px)" }}>{bookings[0].car.brand}</div>
                      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(16px, 1.5vw, 20px)", color: "#fff" }}>{bookings[0].car.name}</div>
                      {bookings.length > 1 && <div style={{ color: "var(--on-surface-variant)", fontSize: "clamp(11px, 0.8vw, 13px)", marginTop: 4 }}>+ {bookings.length - 1} more vehicle{bookings.length > 2 ? "s" : ""}</div>}
                    </div>
                  </div>
                )}
                <div style={{ padding: "clamp(20px, 2.5vw, 28px)", display: "flex", flexDirection: "column", gap: 14 }}>
                  <h3 className="label-caps" style={{ color: "var(--on-surface-variant)", marginBottom: 4, fontSize: "clamp(10px, 0.8vw, 12px)" }}>Summary</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "clamp(14px, 1.2vw, 15px)", color: "var(--on-surface)" }}>
                    <span>Rental Total</span><span>${total.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "clamp(14px, 1.2vw, 15px)", color: "var(--on-surface)" }}>
                    <span>Taxes & Fees (12%)</span><span>${taxes.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "clamp(14px, 1.2vw, 15px)", color: "var(--on-surface)" }}>
                    <span>Security Deposit</span><span>${deposit.toLocaleString()}</span>
                  </div>
                  <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="label-caps" style={{ color: "var(--on-surface-variant)", fontSize: "clamp(10px, 0.8vw, 12px)" }}>Total Due</span>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(24px, 3vw, 30px)", color: "var(--gold)" }}>${grandTotal.toLocaleString()}</span>
                  </div>
                  <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8, padding: "clamp(12px, 1.5vw, 16px)" }} onClick={handleConfirm}>Confirm Booking</button>
                  <button className="btn-secondary" style={{ width: "100%", justifyContent: "center", padding: "clamp(10px, 1.2vw, 14px)" }} onClick={() => navigate("/cars")}>Add Another Vehicle</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .booking-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 40px;
          align-items: start;
        }
        .booking-summary {
          position: sticky;
          top: 100px;
        }
        @media (max-width: 1024px) {
          .booking-grid {
            grid-template-columns: 1fr 320px;
            gap: 30px;
          }
        }
        @media (max-width: 768px) {
          .booking-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .booking-summary {
            position: static;
            margin-top: 24px;
          }
          .booking-grid > div:first-child {
            order: 1;
          }
          .booking-grid > div:last-child {
            order: 2;
          }
          .stepper-line {
            display: none !important;
          }
          .stepper-dot {
            width: 32px !important;
            height: 32px !important;
          }
          .stepper-dot.active {
            width: 40px !important;
            height: 40px !important;
          }
          .glass-light {
            max-width: 100%;
          }
        }
        @media (max-width: 480px) {
          .booking-grid {
            gap: 16px;
          }
          .stepper-dot {
            width: 28px !important;
            height: 28px !important;
          }
          .stepper-dot.active {
            width: 34px !important;
            height: 34px !important;
          }
          .container {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
          .luxury-input {
            font-size: 14px !important;
          }
          button {
            font-size: 12px !important;
            padding: 10px 16px !important;
          }
          .btn-primary {
            padding: 12px 20px !important;
          }
        }
      `}</style>
    </div>
  );
}