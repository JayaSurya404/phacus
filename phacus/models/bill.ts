import mongoose from "mongoose";

const BillSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  total: Number,
  ownerId: mongoose.Schema.Types.ObjectId,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Bill =
  mongoose.models.Bill || mongoose.model("Bill", BillSchema);