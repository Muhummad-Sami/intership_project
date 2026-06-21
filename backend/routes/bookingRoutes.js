import express from "express";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  sendAdminNotification,
  sendUserConfirmation,
  sendUserCancellation,
} from "../utils/email.js";

const router = express.Router();

// ✅ Admin check middleware (must be defined BEFORE routes)
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================================================
// ⚠️ CRITICAL: Special routes must be placed BEFORE "/:id"
// ============================================================

// ✅ RESET SYSTEM
router.delete("/reset-all", verifyToken, isAdmin, async (req, res) => {
  try {
    await Booking.deleteMany({});
    await Car.updateMany({}, { available: true });
    res.json({ message: "System reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ GET ALL BOOKINGS (admin)
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user", "name email")
      .populate("bookedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============================================================
// USER: Create booking (with per‑car overlap check)
// ============================================================
router.post("/request", verifyToken, async (req, res) => {
  try {
    const {
      carName,
      carId,
      car,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      specialRequests,
      passengers,
      timezone,
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User account not found." });
    }

    // ✅ 1. Parse and validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start) || isNaN(end) || start >= end) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    // ✅ 2. Get the car identifier – use a consistent source
    const carIdentifier = String(carId || car?.id || car?._id || "");
    console.log(`🔍 Checking car: ${carName || car?.name}, ID: ${carIdentifier}`);
    console.log(`📥 Request body:`, req.body);

    if (!carIdentifier) {
      return res.status(400).json({ message: "Car ID is required" });
    }

    // ✅ 3. Check for overlapping bookings for the SAME car (exact match on carId)
    const existingBooking = await Booking.findOne({
      carId: carIdentifier,
      status: { $in: ["pending", "confirmed"] },
      $or: [
        {
          startDate: { $lte: end },
          endDate: { $gte: start },
        },
      ],
    });

    if (existingBooking) {
      console.log(`❌ Overlap found: ${existingBooking.carName} (${existingBooking.carId}) already booked for these dates.`);
      return res.status(409).json({
        message: `The ${carName} is already booked for the selected dates. Please choose different dates or another car.`,
      });
    }

    // ✅ 4. Check if the car is marked as available (optional extra)
    const carDoc = await Car.findOne({ carId: parseInt(carIdentifier) });
    if (carDoc && !carDoc.available) {
      return res.status(409).json({
        message: `The ${carName} is currently marked as reserved.`,
      });
    }

    // ✅ 5. Create the booking
    const booking = await Booking.create({
      user: req.user.id,
      carName: carName || car?.name || "Unknown Car",
      carId: carIdentifier,
      car: car || {},
      startDate: start,
      endDate: end,
      pickupLocation: pickupLocation || "",
      dropoffLocation: dropoffLocation || "",
      specialRequests: specialRequests || "",
      passengers: passengers || 1,
      timezone: timezone || 0,
      status: "pending",
    });

    // Send admin email
    let emailSent = false;
    let emailError = null;
    try {
      const populated = await Booking.findById(booking._id).populate("user", "name email");
      await sendAdminNotification(populated);
      emailSent = true;
    } catch (emailErr) {
      emailError = emailErr.message;
      console.error("Admin email error:", emailErr.message);
    }

    res.status(201).json({
      message: "Booking request submitted",
      booking,
      emailSent,
      emailError: emailError || null,
    });
  } catch (err) {
    console.error("❌ Booking request error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ============================================================
// ADMIN: Confirm booking
// ============================================================
router.patch("/confirm/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "confirmed";
    booking.bookedBy = req.user.id;
    await booking.save();

    // Update car availability (set reserved)
    let carUpdated = false;
    const searchId = booking.carId || booking.car?.id;
    if (searchId) {
      const numericId = Number(searchId);
      if (!isNaN(numericId)) {
        const car = await Car.findOne({ carId: numericId });
        if (car) {
          await Car.findByIdAndUpdate(car._id, { available: false });
          carUpdated = true;
          console.log(`✅ Car marked unavailable: ${car.name}`);
        } else {
          console.log("ℹ️ Car not found in DB (booking still valid)");
        }
      }
    }

    let emailSent = false;
    let emailError = null;
    try {
      const populated = await Booking.findById(req.params.id)
        .populate("user", "name email")
        .populate("bookedBy", "name email");
      if (!populated.car) populated.car = booking.car || {};
      console.log(`📧 Attempting to send confirmation to: ${populated.user.email}`);
      await sendUserConfirmation(populated);
      emailSent = true;
    } catch (emailErr) {
      emailError = emailErr.message;
      console.error("❌ User email error:", emailErr.message);
    }

    res.json({
      message: "Booking confirmed",
      booking,
      carUpdated,
      emailSent,
      emailError,
    });
  } catch (err) {
    console.error("❌ Confirm error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ CANCEL BOOKING
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Restore car availability
    const searchId = booking.carId || booking.car?.id;
    if (searchId) {
      const numericId = Number(searchId);
      if (!isNaN(numericId)) {
        await Car.findOneAndUpdate({ carId: numericId }, { available: true });
      }
    }

    let emailSent = false;
    let emailError = null;
    try {
      const populated = await Booking.findById(req.params.id)
        .populate("user", "name email")
        .populate("bookedBy", "name email");
      if (!populated.car) populated.car = booking.car || {};
      console.log(`📧 Attempting to send cancellation to: ${populated.user.email}`);
      await sendUserCancellation(populated);
      emailSent = true;
    } catch (emailErr) {
      emailError = emailErr.message;
      console.error("❌ Cancellation email error:", emailErr.message);
    }

    res.json({
      message: "Booking cancelled",
      emailSent,
      emailError,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ USER: Get my bookings (only pending)
router.get("/", verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
      status: "pending",
    }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;