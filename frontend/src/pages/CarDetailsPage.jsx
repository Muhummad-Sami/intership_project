// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { useBooking } from "../context/BookingContext";
// import { getToken } from "../utils/auth";
// import api from "../api/axios";

// export default function CarDetailsPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { addBooking } = useBooking();

//   const [car, setCar] = useState(location.state?.car || null);
//   const [loading, setLoading] = useState(!car);

//   // Form fields
//   const [pickupDate, setPickupDate] = useState("");
//   const [pickupTime, setPickupTime] = useState("10:00");
//   const [returnDate, setReturnDate] = useState("");
//   const [returnTime, setReturnTime] = useState("10:00");
//   const [pickupLocation, setPickupLocation] = useState("");
//   const [dropoffLocation, setDropoffLocation] = useState("");
//   const [specialRequests, setSpecialRequests] = useState("");
//   const [passengers, setPassengers] = useState(1);

//   const [requestLoading, setRequestLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   // Fetch car if not passed via state
//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       navigate("/login", { state: { from: { pathname: `/car/${id}` } } });
//       return;
//     }

//     if (car) {
//       setLoading(false);
//       return;
//     }

//     api.get("/cars")
//       .then(res => {
//         const found = res.data.find(c => c.carId === parseInt(id));
//         setCar(found || null);
//       })
//       .catch(err => console.error("Failed to load car", err))
//       .finally(() => setLoading(false));
//   }, [id, car, navigate]);

//   const handleRequest = async () => {
//     const token = getToken();
//     if (!token) {
//       navigate("/login", { state: { from: { pathname: `/car/${car.carId}` } } });
//       return;
//     }

//     if (!pickupDate || !returnDate) {
//       setMessage("⚠️ Please select pickup and return dates.");
//       return;
//     }

//     const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
//     const endDateTime = new Date(`${returnDate}T${returnTime}`);
//     if (startDateTime >= endDateTime) {
//       setMessage("⚠️ Return date/time must be after pickup.");
//       return;
//     }

//     setRequestLoading(true);
//     setMessage("");

//     const payload = {
//       car,
//       startDate: startDateTime.toISOString(),
//       endDate: endDateTime.toISOString(),
//       pickupLocation,
//       dropoffLocation,
//       specialRequests,
//       passengers,
//     };

//     const success = await addBooking(payload, true);
//     if (success) {
//       setMessage("✅ Booking request sent! Admin will review.");
//       setTimeout(() => navigate("/booking"), 2000);
//     }
//     setRequestLoading(false);
//   };

//   const startDateTime = pickupDate && pickupTime ? new Date(`${pickupDate}T${pickupTime}`) : null;
//   const endDateTime = returnDate && returnTime ? new Date(`${returnDate}T${returnTime}`) : null;
//   const days = startDateTime && endDateTime
//     ? Math.max(1, Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60 * 24)))
//     : 0;
//   const total = days * (car?.price || 0);
//   const deposit = car?.deposit || Math.round((car?.price || 0) * 5);
//   const grand = total + deposit;

//   if (loading) return <div style={{ paddingTop: 73, textAlign: "center" }}>Loading car details...</div>;
//   if (!car) {
//     return (
//       <div style={{ paddingTop: 73, textAlign: "center", padding: "40px" }}>
//         <h2>Car not found</h2>
//         <button className="btn-primary" onClick={() => navigate("/cars")}>Browse All Cars</button>
//       </div>
//     );
//   }

//   return (
//     <div style={{ paddingTop: 73 }}>
//       {/* Hero */}
//       <div style={{ height: "clamp(250px, 40vh, 400px)", overflow: "hidden", position: "relative" }}>
//         <img src={car.image} alt={car.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//         <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }} />
//         <div style={{ position: "absolute", bottom: 30, left: 30, color: "white" }}>
//           <div style={{ color: "#D4AF37", fontSize: "clamp(10px, 1vw, 14px)", letterSpacing: "2px" }}>{car.brand}</div>
//           <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontFamily: "'Playfair Display', serif" }}>{car.name}</h1>
//           <p style={{ fontSize: "clamp(14px, 1vw, 18px)" }}>{car.subtitle}</p>
//         </div>
//         <div style={{ position: "absolute", top: 20, left: 20 }}>
//           <span style={{
//             padding: "6px 16px",
//             borderRadius: 20,
//             background: car.available ? "#4CAF50" : "#f44336",
//             color: "white",
//             fontSize: "12px",
//             fontWeight: 600
//           }}>
//             {car.available ? "AVAILABLE" : "RESERVED"}
//           </span>
//         </div>
//       </div>

//       <div className="container" style={{ padding: "30px 20px", maxWidth: 1200, margin: "0 auto" }}>
//         {message && (
//           <div style={{
//             padding: 16,
//             borderRadius: 8,
//             marginBottom: 24,
//             background: message.includes("✅") ? "rgba(76,175,80,0.1)" : "rgba(244,67,54,0.1)",
//             border: `1px solid ${message.includes("✅") ? "#4CAF50" : "#f44336"}`,
//             color: message.includes("✅") ? "#4CAF50" : "#f44336"
//           }}>
//             {message}
//           </div>
//         )}

//         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
//           {/* Left: Specs */}
//           <div>
//             <p style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--on-surface-variant)" }}>{car.description}</p>
//             <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 30, background: "rgba(255,255,255,0.03)", padding: 20, borderRadius: 12 }}>
//               {[
//                 ["Engine", car.engine],
//                 ["Transmission", car.transmission],
//                 ["Fuel", car.fuel],
//                 ["Seats", car.seats],
//                 ["Power", car.power],
//                 ["0-60", car.acceleration]
//               ].map(([label, value]) => (
//                 <div key={label} style={{ textAlign: "center" }}>
//                   <div style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>{label}</div>
//                   <div style={{ fontSize: 16, fontWeight: 500 }}>{value || "N/A"}</div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right: Booking Form */}
//           <div style={{
//             background: "var(--surface-container-lowest)",
//             padding: 30,
//             borderRadius: 12,
//             border: "1px solid rgba(255,255,255,0.06)",
//             position: "sticky",
//             top: 100
//           }}>
//             <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28 }}>Book This Car</h2>
//             <p style={{ color: "var(--on-surface-variant)" }}>Complete all details to request a booking.</p>

//             <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
//               {/* Pickup Date + Time */}
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//                 <div>
//                   <label style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Pickup Date</label>
//                   <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
//                     style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface)", outline: "none" }} />
//                 </div>
//                 <div>
//                   <label style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Pickup Time</label>
//                   <input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)}
//                     style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface)", outline: "none" }} />
//                 </div>
//               </div>

//               {/* Return Date + Time */}
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
//                 <div>
//                   <label style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Return Date</label>
//                   <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} min={pickupDate || new Date().toISOString().split("T")[0]}
//                     style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface)", outline: "none" }} />
//                 </div>
//                 <div>
//                   <label style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Return Time</label>
//                   <input type="time" value={returnTime} onChange={e => setReturnTime(e.target.value)}
//                     style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface)", outline: "none" }} />
//                 </div>
//               </div>

//               {/* Pickup Location – TEXT INPUT */}
//               <div>
//                 <label style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Pickup Address</label>
//                 <input
//                   type="text"
//                   value={pickupLocation}
//                   onChange={e => setPickupLocation(e.target.value)}
//                   placeholder="Enter pickup address..."
//                   style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface)", outline: "none" }}
//                 />
//               </div>

//               {/* Drop-off Location – TEXT INPUT */}
//               <div>
//                 <label style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Drop‑off Address</label>
//                 <input
//                   type="text"
//                   value={dropoffLocation}
//                   onChange={e => setDropoffLocation(e.target.value)}
//                   placeholder="Enter drop‑off address..."
//                   style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface)", outline: "none" }}
//                 />
//               </div>

//               {/* Passengers */}
//               <div>
//                 <label style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Passengers</label>
//                 <input type="number" min="1" max="10" value={passengers} onChange={e => setPassengers(Number(e.target.value))}
//                   style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface)", outline: "none" }} />
//               </div>

//               {/* Special Requests */}
//               <div>
//                 <label style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Special Requests (optional)</label>
//                 <textarea value={specialRequests} onChange={e => setSpecialRequests(e.target.value)}
//                   rows="2"
//                   placeholder="Any special requests or additional requirements..."
//                   style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface)", outline: "none", resize: "vertical" }} />
//               </div>

//               {/* Price Summary */}
//               {days > 0 && (
//                 <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8, marginTop: 8 }}>
//                   <div style={{ display: "flex", justifyContent: "space-between" }}><span>Rental ({days} days)</span><span>${total}</span></div>
//                   <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}><span>Deposit</span><span>${deposit}</span></div>
//                   <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12, fontSize: 20, fontWeight: 700, color: "var(--gold)" }}>
//                     <span>Total</span><span>${grand}</span>
//                   </div>
//                   <p style={{ fontSize: 12, color: "var(--on-surface-variant)", marginTop: 8 }}>Requires ${deposit} deposit</p>
//                 </div>
//               )}

//               <button className="btn-primary" onClick={handleRequest} disabled={requestLoading}
//                 style={{ width: "100%", justifyContent: "center", padding: "14px", marginTop: 12 }}>
//                 {requestLoading ? "Sending..." : "📩 Request Booking"}
//               </button>
//               <p style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "var(--on-surface-variant)" }}>
//                 Your request will be reviewed by our concierge.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useBooking } from "../context/BookingContext";
import { getToken } from "../utils/auth";
import api from "../api/axios";

export default function CarDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addBooking } = useBooking();

  const [car, setCar] = useState(location.state?.car || null);
  const [loading, setLoading] = useState(!car);

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("10:00");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [passengers, setPassengers] = useState(1);

  const [requestLoading, setRequestLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login", { state: { from: { pathname: `/car/${id}` } } });
      return;
    }
    if (car) {
      setLoading(false);
      return;
    }
    api.get("/cars")
      .then(res => {
        const found = res.data.find(c => c.carId === parseInt(id));
        setCar(found || null);
      })
      .catch(err => console.error("Failed to load car", err))
      .finally(() => setLoading(false));
  }, [id, car, navigate]);

  const handleRequest = async () => {
    const token = getToken();
    if (!token) {
      navigate("/login", { state: { from: { pathname: `/car/${car.carId}` } } });
      return;
    }
    if (!pickupDate || !returnDate) {
      setMessage("⚠️ Please select pickup and return dates.");
      return;
    }
    const startDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const endDateTime = new Date(`${returnDate}T${returnTime}`);
    if (startDateTime >= endDateTime) {
      setMessage("⚠️ Return date/time must be after pickup.");
      return;
    }
    setRequestLoading(true);
    setMessage("");
    const payload = {
      car,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      pickupLocation,
      dropoffLocation,
      specialRequests,
      passengers,
    };
    const success = await addBooking(payload, true);
    if (success) {
      setMessage("✅ Booking request sent! Admin will review.");
      setTimeout(() => navigate("/booking"), 2000);
    }
    setRequestLoading(false);
  };

  const startDateTime = pickupDate && pickupTime ? new Date(`${pickupDate}T${pickupTime}`) : null;
  const endDateTime = returnDate && returnTime ? new Date(`${returnDate}T${returnTime}`) : null;
  const days = startDateTime && endDateTime
    ? Math.max(1, Math.ceil((endDateTime - startDateTime) / (1000 * 60 * 60 * 24)))
    : 0;
  const total = days * (car?.price || 0);
  const deposit = car?.deposit || Math.round((car?.price || 0) * 5);
  const grand = total + deposit;

  if (loading) return <div style={{ paddingTop: 73, textAlign: "center" }}>Loading car details...</div>;
  if (!car) {
    return (
      <div style={{ paddingTop: 73, textAlign: "center", padding: "40px" }}>
        <h2>Car not found</h2>
        <button className="btn-primary" onClick={() => navigate("/cars")}>Browse All Cars</button>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 73 }}>
      {/* Hero */}
      <div style={{ height: "clamp(250px, 40vh, 400px)", overflow: "hidden", position: "relative" }}>
        <img src={car.image} alt={car.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }} />
        <div style={{ position: "absolute", bottom: 30, left: 30, color: "white" }}>
          <div style={{ color: "#D4AF37", fontSize: "clamp(10px, 1vw, 14px)", letterSpacing: "2px" }}>{car.brand}</div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontFamily: "'Playfair Display', serif" }}>{car.name}</h1>
          <p style={{ fontSize: "clamp(14px, 1vw, 18px)" }}>{car.subtitle}</p>
        </div>
        <div style={{ position: "absolute", top: 20, left: 20 }}>
          <span style={{
            padding: "6px 16px",
            borderRadius: 20,
            background: car.available ? "#4CAF50" : "#f44336",
            color: "white",
            fontSize: "12px",
            fontWeight: 600
          }}>
            {car.available ? "AVAILABLE" : "RESERVED"}
          </span>
        </div>
      </div>

      <div className="container" style={{ padding: "30px 20px", maxWidth: 1200, margin: "0 auto" }}>
        {message && (
          <div style={{
            padding: 16,
            borderRadius: 8,
            marginBottom: 24,
            background: message.includes("✅") ? "rgba(76,175,80,0.1)" : "rgba(244,67,54,0.1)",
            border: `1px solid ${message.includes("✅") ? "#4CAF50" : "#f44336"}`,
            color: message.includes("✅") ? "#4CAF50" : "#f44336"
          }}>
            {message}
          </div>
        )}

        <div className="car-details-grid">
          {/* Left: Specs */}
          <div>
            <p style={{ fontSize: "16px", lineHeight: 1.8, color: "var(--on-surface-variant)" }}>{car.description}</p>
            <div className="specs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 30, background: "rgba(255,255,255,0.03)", padding: 20, borderRadius: 12 }}>
              {[
                ["Engine", car.engine],
                ["Transmission", car.transmission],
                ["Fuel", car.fuel],
                ["Seats", car.seats],
                ["Power", car.power],
                ["0-60", car.acceleration]
              ].map(([label, value]) => (
                <div key={label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>{label}</div>
                  <div style={{ fontSize: 16, fontWeight: 500 }}>{value || "N/A"}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="booking-form" style={{
            background: "var(--surface-container-lowest)",
            padding: 30,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.06)",
            position: "sticky",
            top: 100
          }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28 }}>Book This Car</h2>
            <p style={{ color: "var(--on-surface-variant)" }}>Complete all details to request a booking.</p>

            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Pickup Date + Time */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Pickup Date</label>
                  <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
                    style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface)", outline: "none" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Pickup Time</label>
                  <input type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)}
                    style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface)", outline: "none" }} />
                </div>
              </div>

              {/* Return Date + Time */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Return Date</label>
                  <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} min={pickupDate || new Date().toISOString().split("T")[0]}
                    style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface)", outline: "none" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Return Time</label>
                  <input type="time" value={returnTime} onChange={e => setReturnTime(e.target.value)}
                    style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface)", outline: "none" }} />
                </div>
              </div>

              {/* Pickup Location – TEXT INPUT */}
              <div>
                <label style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Pickup Address</label>
                <input type="text" value={pickupLocation} onChange={e => setPickupLocation(e.target.value)}
                  placeholder="Enter pickup address..."
                  style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface)", outline: "none" }} />
              </div>

              {/* Drop-off Location – TEXT INPUT */}
              <div>
                <label style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Drop‑off Address</label>
                <input type="text" value={dropoffLocation} onChange={e => setDropoffLocation(e.target.value)}
                  placeholder="Enter drop‑off address..."
                  style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface)", outline: "none" }} />
              </div>

              {/* Passengers */}
              <div>
                <label style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Passengers</label>
                <input type="number" min="1" max="10" value={passengers} onChange={e => setPassengers(Number(e.target.value))}
                  style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface)", outline: "none" }} />
              </div>

              {/* Special Requests */}
              <div>
                <label style={{ fontSize: 12, color: "var(--on-surface-variant)" }}>Special Requests (optional)</label>
                <textarea value={specialRequests} onChange={e => setSpecialRequests(e.target.value)}
                  rows="2"
                  placeholder="Any special requests or additional requirements..."
                  style={{ width: "100%", padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--on-surface)", outline: "none", resize: "vertical" }} />
              </div>

              {/* Price Summary */}
              {days > 0 && (
                <div style={{ background: "rgba(255,255,255,0.03)", padding: 16, borderRadius: 8, marginTop: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><span>Rental ({days} days)</span><span>${total}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}><span>Deposit</span><span>${deposit}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12, fontSize: 20, fontWeight: 700, color: "var(--gold)" }}>
                    <span>Total</span><span>${grand}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--on-surface-variant)", marginTop: 8 }}>Requires ${deposit} deposit</p>
                </div>
              )}

              <button className="btn-primary" onClick={handleRequest} disabled={requestLoading}
                style={{ width: "100%", justifyContent: "center", padding: "14px", marginTop: 12 }}>
                {requestLoading ? "Sending..." : "📩 Request Booking"}
              </button>
              <p style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "var(--on-surface-variant)" }}>
                Your request will be reviewed by our concierge.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .car-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: start;
        }
        .booking-form {
          position: sticky;
          top: 100px;
        }
        @media (max-width: 768px) {
          .car-details-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .booking-form {
            position: static;
          }
          .specs-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .car-details-grid > div:first-child {
            order: 1;
          }
          .car-details-grid > div:last-child {
            order: 2;
          }
        }
        @media (max-width: 480px) {
          .specs-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 12px !important;
            padding: 16px !important;
          }
          .booking-form {
            padding: 20px !important;
          }
          .container {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
        }
      `}</style>
    </div>
  );
}