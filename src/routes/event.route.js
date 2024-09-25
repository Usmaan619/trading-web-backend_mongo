import express from "express";
import { createEvents, getEvent } from "../services/events.service.js";

const router = express();

// Now you can continue with your route handling using the 'router' instance.

router.post("/createEvent", async (req, res, next) => {
  try {
    const data = await createEvents(req.body);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    throw error;
  }
});

router.get("/getAllEvents", async (req, res, next) => {
  try {
    const data = await Event.find({});
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    throw error;
  }
});
router.get("/getEvent", async (req, res, next) => {
  try {
    const data = await getEvent(req.body.id);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    throw error;
  }
});

export default router;
