import mongoose, { Schema } from "mongoose";
const scheduleMeetingSchema = new Schema({
  email: {
    type: String,
  },
  phone: {
    type: Number,
  },
  description: {
    type: String,
  },
  website: {
    type: String,
  },
});

export const ScheduleMeeting = mongoose.model(
  "ScheduleMeeting",
  scheduleMeetingSchema
);
