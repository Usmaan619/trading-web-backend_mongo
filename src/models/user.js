import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import { Role } from "./role.js";
import { Permission } from "./permission.js";

const saltRounds = 15;
const { ObjectId } = Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      default: "",
    },
    mobNo: {
      type: String,
      default: "",
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],

    // role: { type: Schema.Types.ObjectId, ref: "Role" },
    role: { type: String, default: "user" },
    password: {
      type: String,
    },
    userProfile: {
      type: String,
    },

    countryCode: {
      type: String,
    },

    pin: {
      type: String,
      default: "",
    },
    countryId: { type: Schema.Types.ObjectId, ref: "Country" },

    providers: {
      type: Array,
      default: [],
    },
    otp: {
      type: Number,
    },

    emailOtp: {
      type: Number,
    },

    mobNoOtp: {
      type: Number,
    },

    createdBy: {
      type: ObjectId,
    },

    isRegistered: {
      type: Boolean,
      default: false,
    },

    count: {
      type: Number,
      default: 0,
    },

    promoCode: { type: String },

    connectedWallets: [],

    thirdPartyConnects: [{ name: "", type: "", id: "" }],

    cardId: { type: mongoose.Types.ObjectId, ref: "Card" },

    email: {
      type: String,
      default: "",
    },
    cartId: { type: mongoose.Types.ObjectId, ref: "Cart" },
  },
  {
    timestamps: true,
  }
);

/* hash the password before save */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

/* user schema methods */
userSchema.methods.comparePassword = async function (password, hashPwsd) {
  const match = await bcrypt.compare(password, hashPwsd);
  return match;
};

export const User = mongoose.model("User", userSchema);
