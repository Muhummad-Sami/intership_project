import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const ADMIN_EMAIL = process.env.EMAIL_TO || "admin@drivelux.com";
const SENDER_EMAIL = process.env.EMAIL_USER || "noreply@drivelux.com";

// ----- Helper: Build Luxury Email HTML -----
const buildLuxuryEmail = ({
  title,
  customerName,
  carName,
  carBrand,
  carImage,
  pickupDate,
  returnDate,
  status,
  adminName,
  message,
  actionButton,
  actionUrl,
  pickupLocation,
  dropoffLocation,
  specialRequests,
  passengers,
}) => {
  const statusColor = status === "CONFIRMED" ? "#4CAF50" : status === "PENDING" ? "#FF9800" : "#f44336";
  const statusLabel = status || "RESERVED";
  const brand = carBrand || "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
      <style>
        body, table, td, p, div { font-family: 'Inter', Arial, sans-serif; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #0f0f0f; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.8); }
        .header { background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%); padding: 40px 30px 20px; text-align: center; border-bottom: 2px solid #D4AF37; }
        .header h1 { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 28px; color: #D4AF37; letter-spacing: 2px; margin: 0; }
        .header .tagline { font-size: 12px; color: #aaa; letter-spacing: 4px; text-transform: uppercase; margin-top: 4px; }
        .hero { padding: 0; text-align: center; background: #1a1a1a; }
        .hero img { max-width: 100%; max-height: 300px; border-radius: 12px; margin: 20px auto; display: block; object-fit: cover; }
        .content { padding: 30px 30px 20px; background: #141414; }
        .content h2 { font-family: 'Playfair Display', serif; color: #D4AF37; font-size: 24px; margin-top: 0; font-weight: 600; }
        .content p { color: #e0e0e0; line-height: 1.7; font-size: 15px; margin: 12px 0; }
        .details { background: #1e1e1e; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #D4AF37; }
        .details-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #2a2a2a; }
        .details-row:last-child { border-bottom: none; }
        .details-label { color: #aaa; font-size: 13px; font-weight: 400; }
        .details-value { color: #fff; font-weight: 500; font-size: 15px; }
        .status-badge { display: inline-block; background: ${statusColor}; color: #fff; padding: 4px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
        .button { display: inline-block; background: #D4AF37; color: #000; font-weight: 600; text-decoration: none; padding: 12px 30px; border-radius: 30px; font-size: 14px; letter-spacing: 0.5px; transition: all 0.3s; text-align: center; border: none; cursor: pointer; }
        .button:hover { background: #c5a028; }
        .footer { background: #0a0a0a; padding: 20px 30px; text-align: center; border-top: 1px solid #2a2a2a; }
        .footer p { color: #777; font-size: 12px; margin: 4px 0; }
        .footer .social { margin: 12px 0; }
        .footer .social a { color: #D4AF37; text-decoration: none; margin: 0 8px; font-size: 14px; font-weight: 500; }
        @media only screen and (max-width: 480px) {
          .container { border-radius: 0; }
          .content { padding: 20px; }
          .header h1 { font-size: 22px; }
          .details-row { flex-direction: column; padding: 10px 0; }
          .button { display: block; width: 100%; text-align: center; }
        }
      </style>
    </head>
    <body style="background:#0a0a0a; padding:20px; margin:0;">
      <div class="container">
        <div class="header"><h1>⬡ DriveLux</h1><div class="tagline">Luxury Automotive Concierge</div></div>
        ${carImage ? `<div class="hero"><img src="${carImage}" alt="${carName}" /></div>` : ''}
        <div class="content">
          <h2>${title}</h2>
          <p>Dear ${customerName || 'Valued Client'},</p>
          <p>${message}</p>
          <div class="details">
            ${carName ? `<div class="details-row"><span class="details-label">Vehicle</span><span class="details-value">${brand ? brand + ' ' : ''}${carName}</span></div>` : ''}
            ${pickupDate ? `<div class="details-row"><span class="details-label">Pickup Date/Time</span><span class="details-value">${new Date(pickupDate).toLocaleString()}</span></div>` : ''}
            ${returnDate ? `<div class="details-row"><span class="details-label">Return Date/Time</span><span class="details-value">${new Date(returnDate).toLocaleString()}</span></div>` : ''}
            ${pickupLocation ? `<div class="details-row"><span class="details-label">Pickup Location</span><span class="details-value">${pickupLocation}</span></div>` : ''}
            ${dropoffLocation ? `<div class="details-row"><span class="details-label">Drop‑off Location</span><span class="details-value">${dropoffLocation}</span></div>` : ''}
            ${passengers ? `<div class="details-row"><span class="details-label">Passengers</span><span class="details-value">${passengers}</span></div>` : ''}
            ${specialRequests ? `<div class="details-row"><span class="details-label">Special Requests</span><span class="details-value">${specialRequests}</span></div>` : ''}
            ${status ? `<div class="details-row"><span class="details-label">Status</span><span class="details-value"><span class="status-badge">${statusLabel}</span></span></div>` : ''}
            ${adminName ? `<div class="details-row"><span class="details-label">Booked By</span><span class="details-value">${adminName}</span></div>` : ''}
          </div>
          ${actionButton ? `<div style="text-align:center; margin-top:24px;"><a href="${actionUrl}" class="button">${actionButton}</a></div>` : ''}
        </div>
        <div class="footer">
          <div class="social"><a href="#">Instagram</a> <span style="color:#444;">|</span> <a href="#">Facebook</a> <span style="color:#444;">|</span> <a href="#">YouTube</a></div>
          <p>© ${new Date().getFullYear()} DriveLux. All rights reserved.</p>
          <p style="font-size:11px; color:#555;">This email was sent to you as a valued client of DriveLux.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// ----- Send Admin Notification -----
export const sendAdminNotification = async (booking) => {
  try {
    const user = booking.user;
    const {
      car,
      carName,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      specialRequests,
      passengers,
    } = booking;

    const html = buildLuxuryEmail({
      title: "📩 New Booking Request",
      customerName: "Admin",
      carName: carName || "Unknown Car",
      carBrand: car?.brand || "",
      carImage: car?.image || null,
      pickupDate: startDate,
      returnDate: endDate,
      status: "PENDING",
      pickupLocation: pickupLocation || "",
      dropoffLocation: dropoffLocation || "",
      specialRequests: specialRequests || "",
      passengers: passengers || 1,
      message: "A new booking request has been submitted. Please review and confirm the availability.",
      actionButton: "🔑 Review in Admin Panel",
      actionUrl: "http://localhost:5173/admin",
    });

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: SENDER_EMAIL, name: "DriveLux" },
        to: [{ email: ADMIN_EMAIL, name: "Admin" }],
        subject: `📩 New Booking Request: ${carName} by ${user.name}`,
        htmlContent: html,
      },
      {
        headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
      }
    );
    console.log("✅ Admin notification sent to", ADMIN_EMAIL);
  } catch (err) {
    console.error("❌ Admin email error:", err.response?.data || err.message);
  }
};

// ----- Send User Confirmation -----
export const sendUserConfirmation = async (booking) => {
  try {
    const user = booking.user;
    const admin = booking.bookedBy;
    const {
      car,
      carName,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      specialRequests,
      passengers,
    } = booking;

    const carData = car || {};
    const carBrand = carData.brand || "";

    const html = buildLuxuryEmail({
      title: "🎉 Booking Confirmed!",
      customerName: user.name,
      carName: carName || "Your Vehicle",
      carBrand: carBrand,
      carImage: carData.image || null,
      pickupDate: startDate,
      returnDate: endDate,
      status: "CONFIRMED",
      adminName: admin?.name || "DriveLux Concierge",
      pickupLocation: pickupLocation || "",
      dropoffLocation: dropoffLocation || "",
      specialRequests: specialRequests || "",
      passengers: passengers || 1,
      message: `Your booking for the ${carBrand ? carBrand + ' ' : ''}${carName || 'vehicle'} has been confirmed by our concierge team. We look forward to welcoming you.`,
      actionButton: "📋 View My Bookings",
      actionUrl: "http://localhost:5173/booking",
    });

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: SENDER_EMAIL, name: "DriveLux Concierge" },
        replyTo: { email: ADMIN_EMAIL, name: "DriveLux Admin" },
        to: [{ email: user.email, name: user.name }],
        subject: `✅ Your DriveLux Booking Confirmed – ${carName}`,
        htmlContent: html,
      },
      {
        headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
      }
    );
    console.log("✅ User confirmation sent to", user.email);
  } catch (err) {
    console.error("❌ User email error:", err.response?.data || err.message);
  }
};

// ----- NEW: Send User Cancellation -----
export const sendUserCancellation = async (booking) => {
  try {
    const user = booking.user;
    const admin = booking.bookedBy;
    const {
      car,
      carName,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      specialRequests,
      passengers,
    } = booking;

    const carData = car || {};
    const carBrand = carData.brand || "";

    const html = buildLuxuryEmail({
      title: "⛔ Booking Cancelled",
      customerName: user.name,
      carName: carName || "Your Vehicle",
      carBrand: carBrand,
      carImage: carData.image || null,
      pickupDate: startDate,
      returnDate: endDate,
      status: "CANCELLED",
      adminName: admin?.name || "DriveLux Concierge",
      pickupLocation: pickupLocation || "",
      dropoffLocation: dropoffLocation || "",
      specialRequests: specialRequests || "",
      passengers: passengers || 1,
      message: `We regret to inform you that your booking for the ${carBrand ? carBrand + ' ' : ''}${carName || 'vehicle'} has been cancelled by our concierge team because the car already reserved. If this was a mistake, please contact us immediately.`,
      actionButton: "📋 View My Bookings",
      actionUrl: "http://localhost:5173/booking",
    });

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: SENDER_EMAIL, name: "DriveLux Concierge" },
        replyTo: { email: ADMIN_EMAIL, name: "DriveLux Admin" },
        to: [{ email: user.email, name: user.name }],
        subject: `⛔ Your DriveLux Booking Cancelled – ${carName}`,
        htmlContent: html,
      },
      {
        headers: { "api-key": BREVO_API_KEY, "Content-Type": "application/json" },
      }
    );
    console.log("✅ Cancellation email sent to", user.email);
  } catch (err) {
    console.error("❌ Cancellation email error:", err.response?.data || err.message);
  }
};