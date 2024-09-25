import mongoose, { Schema } from "mongoose";


const countrySchema = new Schema(
  {
    alpha2: {
      type: String,
    },
    alpha3: {
      type: String,
    },
    countryCallingCodes: {
      type: Array,
    },
    currencies: {
      type: Array,
    },
    ioc: {
      type: String,
    },
    languages: {
      type: Array,
    },
    name: {
      type: String,
    },
    status: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    strict: true,
    timestamps: true,
  }
);

export const Country = mongoose.model("Country", countrySchema);


