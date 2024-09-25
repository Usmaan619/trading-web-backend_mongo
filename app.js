import "./globals.js";
import express from "express";
import helmet from "helmet";
import path from "path";
import cookieParser from "cookie-parser";
import api from "./src/routes/api.js";
import { MongoManager } from "./src/mongo/MongoManager.js";
import logger from "morgan";
import passport from "passport";
import bodyParser from "body-parser";
import seeders from "./src/utils/seeders.js";
import cors from "./src/middleware/cors.js";
import rateLimiter from "./src/middleware/rateLimiter.js";
import tooBusyMiddleware from "./src/middleware/tooBusy.js";
const app = express();
const mongoManager = new MongoManager();

let lastCommit = "";

/**
 * CORS
 */
app.use(cors);
app.use(helmet());
app.use(rateLimiter);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({ limit: "50kb" }));
app.use(bodyParser.urlencoded({ extended: true }));

// Use the tooBusyMiddleware for all routes
app.use(tooBusyMiddleware);

/**
 * Connects to MongoDB
 */
mongoManager.connect();

/**
 * Create Default Admin
 */
// admin.createAdmin();

/**
 * initializes passport authentication
 */
app.use(passport.initialize());

/**
 * Seeders
 */
// setTimeout(seeders.seed, 0);

/**
 * Registered main api route
 */
app.use("/api", api);

/**
 * For non-registered route
 */
app.use("/", (req, res) => {
  res.statusCode = 200;
  res.json({
    status: "success",
    message: "Route not registered",
    data: {
      env: process.env.NODE_ENV,
      lastCommit,
    },
  });
});

import { exec } from "child_process";
exec("git log --oneline -1", (err, stdout) => {
  lastCommit = stdout;
});

export default app;
