import mongoose from "mongoose";
import dotenv from "dotenv";
import Car from "./models/Car.js";
import { cars } from "../frontend/src/data/cars.js"; // adjust path if needed

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seed = async () => {
  try {
    await Car.deleteMany();
    const formatted = cars.map(c => ({
      carId: c.id,                // ← critical: match frontend IDs
      name: c.name,
      price: c.price,
      image: c.image,
      brand: c.brand,
      category: c.category,
      available: c.available ?? true,
      deposit: c.deposit || 0,
      acceleration: c.acceleration,
      power: c.power,
      transmission: c.transmission,
      fuel: c.fuel,
      seats: c.seats,
      engine: c.engine,
      description: c.description,
      subtitle: c.subtitle,
    }));
    await Car.insertMany(formatted);
    console.log("✅ Cars seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seed();