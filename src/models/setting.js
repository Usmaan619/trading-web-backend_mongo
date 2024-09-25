import mongoose, { Schema } from "mongoose";

const settingSchema = new Schema(
  {
    iconsS3Url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Setting = mongoose.model("Setting", settingSchema);


