import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  brand: String,
  category: String,
  available: { type: Boolean, default: true },
  deposit: { type: Number, default: 0 },
  acceleration: String,
  power: String,
  transmission: String,
  fuel: String,
  seats: String,
  engine: String,
  description: String,
  subtitle: String,
});

export default mongoose.model("Car", carSchema);