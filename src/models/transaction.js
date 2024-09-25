import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    amount: {
      type: Number,
    },
    currencyCode: {
      type: String,
      default: "USD",
    },
    transacitonType: {
      type: String,
      enum: ["pizza", "burgur", "cart", "mcDonalds", "others", "addFunds"],
    },
    status: {
      type: String,
      default: false,
      enum: ["pending", "failed", "completed"],
    },
    type: {
      type: String,
      enum: ["Credit", "Debit"],
    },
    addTo: {
      type: String,
    },
    deductFrom: {
      type: String,
    },
    description: {
      type: String,
    },
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  {
    strict: true,
    timestamps: true,
  }
);

export const Transaction = mongoose.model("Transaction", schema);
