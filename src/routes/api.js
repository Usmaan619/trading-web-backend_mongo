import express from "express";
import { errorHandler } from "../middleware/index.js";
import { login, sendOtp, me, adminMe } from "../controllers/users/login.js";
import { authMiddleware } from "../middleware/checkAuth.js";
import commonRoutes from "./common/index.js";
import userRoutes from "./user.route.js";
import s3Routes from "./s3.route.js";
import transactionRoutes from "./transaction.route.js";
import portfolioRoutes from "./portfolio.route.js";
import providersRoutes from "./providers.route.js";
import eventRoutes from "./event.route.js";

const router = express();

/**
 * register api points
 * */
router.use("/c", commonRoutes);
router.use("/s3", s3Routes);

/**
 * Authentication routes
 * */
router.post("/login", login);
router.post("/sendOtp", sendOtp);
router.get("/me", authMiddleware, me);
router.get("/adminMe", authMiddleware, adminMe);

/**
 * Other routes
 * */
router.use("/user", userRoutes);
router.use("/transaction", transactionRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/providers", providersRoutes);
router.use("/events", eventRoutes);

/**
 * catch api all errors
 * */
router.use(errorHandler);

export default router;
