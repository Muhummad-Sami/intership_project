import express from "express";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import {
  sendAdminNotification,
  sendUserConfirmation,
  sendUserCancellation,   // ✅ Added
} from "../utils/email.js";

const router = express.Router();

// Admin check middleware
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

// USER: Create booking (with all details)
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
    } = req.body;

    const booking = await Booking.create({
      user: req.user.id,
      carName: carName || car?.name || "Unknown Car",
      carId: carId || car?.id || "",
      car: car || {},
      startDate,
      endDate,
      pickupLocation: pickupLocation || "",
      dropoffLocation: dropoffLocation || "",
      specialRequests: specialRequests || "",
      passengers: passengers || 1,
      status: "pending",
    });

    // Send admin email (non-blocking)
    try {
      const populated = await Booking.findById(booking._id).populate(
        "user",
        "name email"
      );
      await sendAdminNotification(populated);
    } catch (emailErr) {
      console.error("Admin email error:", emailErr.message);
    }

    res.status(201).json({
      message: "Booking request submitted",
      booking,
    });
  } catch (err) {
    console.error("❌ Booking request error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: Confirm booking
router.patch("/confirm/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = "confirmed";
    booking.bookedBy = req.user.id;
    await booking.save();

    console.log("✅ Booking confirmed");

    // Update car availability
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

    // Send user confirmation email
    try {
      const populated = await Booking.findById(req.params.id)
        .populate("user", "name email")
        .populate("bookedBy", "name email");
      if (!populated.car) populated.car = booking.car || {};
      await sendUserConfirmation(populated);
      console.log("✅ User confirmation email sent");
    } catch (emailErr) {
      console.error("❌ User email error:", emailErr.message);
    }

    res.json({
      message: "Booking confirmed",
      booking,
      carUpdated,
    });
  } catch (err) {
    console.error("❌ Confirm error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ✅ ADMIN: Cancel booking – sends cancellation email
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

    // ✅ Send cancellation email to user
    try {
      const populated = await Booking.findById(req.params.id)
        .populate("user", "name email")
        .populate("bookedBy", "name email");
      if (!populated.car) populated.car = booking.car || {};
      await sendUserCancellation(populated);
      console.log("✅ Cancellation email sent to", populated.user.email);
    } catch (emailErr) {
      console.error("❌ Cancellation email error:", emailErr.message);
    }

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// USER: Get my bookings (only pending)
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

// ADMIN: Get all bookings
router.get("/all", verifyToken, isAdmin, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("bookedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;