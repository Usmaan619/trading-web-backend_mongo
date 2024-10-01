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
    },
    description: {
      type: String,
      required: true,
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const TaskDaily = mongoose.model("TicketDailyUpdate", ticketSchema);
