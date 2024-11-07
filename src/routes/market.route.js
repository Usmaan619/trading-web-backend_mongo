import express from "express";
import pkg from "rest-api-errors";
import yahooFinance from "yahoo-finance2";
const { APIError } = pkg;
const router = express();

router.get("/getIndexes", async (req, res, next) => {
  try {
    const symbol = [
      "^NSEI",
      "^BSESN",
      "^NSEBANK",
      "^DJI",
      "^IXIC",
      "NASDAQ:AAPL", 
      "BTC-USD",
      "ETH-USD",
      "SOL-USD",
      "BNB-USD",
      "GC=F",
      "SI=F",
      "HG=F",
      "CL=F",
      "NG=F",
    ];

    const data = await yahooFinance.quote(symbol);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

export default router;
