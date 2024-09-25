import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema({
  roleName: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  permissions: [{ type: mongoose.Types.ObjectId, ref: "Permission" }],
});

export const Role = mongoose.model("Role", roleSchema);
