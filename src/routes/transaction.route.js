import express from "express";
import { APIError } from "rest-api-errors";
import { createTransaction } from "../services/transaction.service.js";
import { Transaction } from "../models/transaction.js";
import { authMiddleware } from "../middleware/checkAuth.js";

const router = express();

router.post("/create", authMiddleware, async (req, res, next) => {
  try {
    if (!req.user?._id) throw new APIError("User ID not found from token!");

    let body = req.body;
    body = {
      ...body,
      userId: req.user?._id,
    };

    const data = await createTransaction(body);
    res.json({
      success: true,
      message: "Transaction created succesfully",
    });
  } catch (error) {
    next(error);
  }
});

router.get("/getAll", authMiddleware, async (req, res, next) => {
  try {
    let data = "";
    if (!req.user?._id) throw new APIError("User ID not found from token!");

    const limit = req?.query?.limit ? req?.query?.limit : 3;

    if (req?.query?.limit) {
      data = await Transaction.find({ userId: req.user?._id })
        .sort({ _id: -1 })
        .limit(limit);
    } else {
      data = await Transaction.find({ userId: req.user?._id }).sort({
        _id: -1,
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
