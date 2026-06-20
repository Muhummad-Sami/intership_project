// import mongoose from "mongoose";

// const bookingSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     carName: {
//       type: String,
//       required: true,
//     },
//     carId: {
//       type: String, // ✅ Changed to String to accept numeric IDs
//       required: true,
//     },
//     car: {
//       type: Object,
//       required: true,
//     },
//     startDate: {
//       type: Date,
//       required: true,
//     },
//     endDate: {
//       type: Date,
//       required: true,
//     },
//     status: {
//       type: String,
//       default: "pending",
//       enum: ["pending", "confirmed", "cancelled"],
//     },
//     bookedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Booking", bookingSchema);


import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    carName: { type: String, required: true },
    carId: { type: String, required: true },
    car: { type: Object, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    // ✅ New fields
    pickupLocation: { type: String, default: "" },
    dropoffLocation: { type: String, default: "" },
    specialRequests: { type: String, default: "" },
    passengers: { type: Number, default: 1 },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "cancelled"],
    },
    bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);