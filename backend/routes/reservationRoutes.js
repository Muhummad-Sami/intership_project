import express from "express";
import Reservation from "../models/Reservation.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE reservation (BOOK CAR)
router.post("/", verifyToken, async (req, res) => {
  try {
    const {
      carId,
      carName,
      pricePerDay,
      fromDate,
      toDate,
    } = req.body;

    const days =
      (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24);

    const totalPrice = days * pricePerDay;

    const reservation = await Reservation.create({
      userId: req.user.id,
      carId,
      carName,
      pricePerDay,
      fromDate,
      toDate,
      totalPrice,
    });

    res.status(201).json({
      message: "Car reserved successfully",
      reservation,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;