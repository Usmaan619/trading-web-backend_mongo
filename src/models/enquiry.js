import mongoose, { Schema } from "mongoose";


const schema = new Schema({
  name: {
    type: String,
  },
  message: {
    type: String,
  },
  email: {
    type: String,
  },
  subject: {
    type: String,
  },
});

export const Enquiry = mongoose.model("Enquiry", schema);


