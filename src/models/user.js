import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import { Role } from "./role.js";
import { Permission } from "./permission.js";

const saltRounds = 15;
const { ObjectId } = Schema;
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["Trader", "Investor", "Admin"],
      default: "Trader",
    },
    totalInvestment: {
      type: Number,
      default: 0.0,
    },
    portfolio: [
      {
        assetName: {
          type: String,
          required: true,
        },
        assetType: {
          type: String,
          enum: ["Stock", "Crypto", "Forex", "Commodity"],
          required: true,
        },
        amountInvested: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        currentPrice: {
          type: Number,
          default: 0.0,
        },
        profitLoss: {
          type: Number,
          default: 0.0,
        },
        purchaseDate: {
          type: Date,
          required: true,
        },
      },
    ],
    userProfile: {
      type: String,
    },
    transactions: [
      {
        type: {
          type: String,
          enum: ["Buy", "Sell", "Deposit", "Withdraw"],
          required: true,
        },
        assetName: String,
        assetType: String,
        amount: Number,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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
