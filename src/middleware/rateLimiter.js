import rateLimiter from "express-rate-limit";

const rateLimiterMiddleware = rateLimiter({
  max: Number(process.env.RATE_LIMIT),
  windowMS: Number(process.env.RATE_LIMIT_SEC), // 10 seconds
  standardHeaders: true, // Return rate limit info in the RateLimit-* headers
  legacyHeaders: false, // Disable the X-RateLimit-* headers
  message: {
    type: "error",
    message: "You can't make any more requests at the moment. Try again later",
  },
});

export default rateLimiterMiddleware;
