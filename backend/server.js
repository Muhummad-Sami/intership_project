import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import carRoutes from "./routes/carRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/cars", carRoutes);

app.get("/", (req, res) => {
  res.send("DriveLux API Running...");
});

// ✅ Connect to MongoDB (top-level – fine for serverless)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err.message));

// ❌ REMOVE the `app.listen` line – Vercel will call the exported app
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));

// ✅ Export the app for Vercel
export default app;