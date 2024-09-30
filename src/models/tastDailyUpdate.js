import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    ticketNo: {
      type: Number,
      required: true,
      unique: true,
    },
    about: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      enum: ["bug", "feature", "improvement", "urgent", "other"],
      default: "other",
    },
  },
  { timestamps: true }
);

// ticketSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

export const Ticket = mongoose.model("Ticket", ticketSchema);
