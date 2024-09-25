import mongoose, { Schema } from "mongoose";

const schema = new Schema({
  name: {
    type: String,
    required: [true],
  },
  subject: {
    type: String,
    required: [true],
  },
  message: {
    type: String,
    required: [true],
  },
  email: {
    type: String,
    required: [true],
  },
});

export const ContactUs = mongoose.model("ContactUs", schema);
