import mongoose from "mongoose";

const MedicineSchema = new mongoose.Schema({
  name: String,
  stock: Number,
  price: Number,
  expiryDate: Date, // ✅ NEW
  ownerId: mongoose.Schema.Types.ObjectId,
});

export const Medicine =
  mongoose.models.Medicine || mongoose.model("Medicine", MedicineSchema);