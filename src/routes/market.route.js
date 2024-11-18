import axios from "axios";
import express from "express";
import puppeteer from "puppeteer";
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
router.get("/getBySymbolIndex", async (req, res, next) => {
  try {
    const data = await yahooFinance.quote(req?.query?.symbol);

    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
});

router.get("/getAMFIFundData", async (req, res, next) => {
  try {
    // AMFI (Association of Mutual Funds in India) Official Data
    const response = await axios.get(
      "https://www.amfiindia.com/spages/NAVAll.txt"
    );
    const data = response.data;

    // Parse the NAV data
    const funds = data.split("\n").slice(10); // Skip headers
    const parsedFunds = funds.map((line) => {
      const fields = line.split(";");
      return {
        schemeCode: fields[0]?.trim(),
        schemeName: fields[3]?.trim(),
        nav: fields[4]?.trim(),
        date: fields[5]?.trim(),
      };
    });

    console.log("Sample Fund Data:", parsedFunds.slice(0, 5)); // Display first 5 entries
    const datas = parsedFunds.slice(0, 5);
    console.log("parsedFunds: ", parsedFunds?.length);

    res.json({
      data: parsedFunds?.filter((fund) => fund?.schemeCode && fund?.schemeName),
      success: true,
    });
  } catch (error) {
    next(error);
    console.error("Error fetching fund data:", error);
  }
});

async function scrapeMoneycontrolFunds() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Example URL for HDFC Mid-Cap Opportunities Fund
  await page.goto(
    "https://www.moneycontrol.com/mutual-funds/nav/hdfc-mid-cap-opportunities-fund/MHD041"
  );

  const fundDetails = await page.evaluate(() => {
    const nav = document.querySelector(".amt").innerText.trim(); // NAV value
    const category = document.querySelector(".sub_title").innerText.trim(); // Fund category
    const details = {
      nav,
      category,
    };
    return details;
  });

  console.log("Fund Details:", fundDetails);

  await browser.close();
}

async function scrapeIndianFunds() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Go to the Moneycontrol Mutual Funds page
  await page.goto("https://www.moneycontrol.com/mutualfundindia/");

  // Example: Extract top-rated funds
  const funds = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(".MFListingTable tbody tr")
    ).map((row) => {
      const columns = row.querySelectorAll("td");
      return {
        name: columns[0]?.innerText.trim(),
        category: columns[1]?.innerText.trim(),
        nav: columns[2]?.innerText.trim(),
        returns1Y: columns[3]?.innerText.trim(),
        returns3Y: columns[4]?.innerText.trim(),
      };
    });
  });

  console.log("Top Funds:", funds);

  await browser.close();
  return funds;
}

async function scrapeMoneycontrol() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    // Navigate to Moneycontrol's mutual fund page
    await page.goto(
      "https://www.moneycontrol.com/mutual-funds/nav/hdfc-mid-cap-opportunities-fund/MHD041"
    );

    const fundDetails = await page.evaluate(() => {
      return {
        fundName: document.querySelector("h1").innerText.trim(),
        nav: document.querySelector(".amt")?.innerText.trim(),
        category: document.querySelector(".sub_title")?.innerText.trim(),
      };
    });

    console.log("Fund Details:", fundDetails);
    return fundDetails;
  } catch (error) {
    console.error("Error scraping Moneycontrol:", error.message);
  } finally {
    await browser.close();
  }
}

export default router;
