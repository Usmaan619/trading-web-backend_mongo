import express from "express";
import pkg from 'rest-api-errors';
const { APIError } = pkg;
import { authMiddleware } from "../middleware/checkAuth.js";
import { connectWallet } from "../services/providers.service.js";

const router = express();

router.post("/connect", authMiddleware, async (req, res, next) => {
  try {
    if (!req.user?._id) throw new APIError("User ID not found from token!");

    const data = await connectWallet({ ...req?.body, userId: req.user?._id });
    res.json({
      data,
      success: true,
      message: "Wallet connected successful",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/getAll", authMiddleware, async (req, res, next) => {
  try {
    if (!req.user?._id) throw new APIError("User ID not found from token!");

    const data = await ConnectedProviders.find({ userId: req.user?._id });

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
