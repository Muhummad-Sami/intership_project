import express from "express";
import Car from "../models/Car.js";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin only
router.post("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json({ message: "Car added", car });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id/availability", verifyToken, isAdmin, async (req, res) => {
  try {
    const { available } = req.body;
    const car = await Car.findByIdAndUpdate(
      req.params.id,
      { available },
      { new: true }
    );
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json({ message: "Car availability updated", car });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json({ message: "Car updated", car });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json({ message: "Car deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;