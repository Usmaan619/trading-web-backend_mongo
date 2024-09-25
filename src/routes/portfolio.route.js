import express from "express";
import { ScheduleMeeting } from "../models/scheduleMeeting.js";
import { createEmailTransporter } from "../services/helper.js";
import { createEnquiry } from "../controllers/users/user.controller.js";

const router = express();

const from = process.env.BHAIPAY_EMAIL;

router.post("/createEnquiry", async (req, res, next) => {
  try {
    const data = await createEnquiry(req.body);
    res.json({
      success: true,
      data,
    });
  } catch (error) {
    error;
  }
});

router.post("/scheduleMeeting", async (req, res, next) => {
  try {
    const data = await ScheduleMeeting.create(req.body);
    const email = req.body.email;
    const phone = req.body.phone;
    const description = req.body.description;
    const website = req.body.website;

    let emailTransporter = await createEmailTransporter();

    let emailOptions = {
      subject: "One Time Code for Activate Account",
      to: req.body.email,
      from,

      html: `Hello,<br>
      Email: ${email}<br>
      Phone: ${phone}<br>
      Description: ${description}<br>
      website: ${website}`,
    };
    const response = await emailTransporter.sendMail(emailOptions);

    if (!response) {
      throw new APIError(422, "422", "Email sending failed.");
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/speakingEngagement", async (req, res, next) => {
  try {
    const data = await SpeakingEngagement.create(req.body);

    const email = req.body.email;
    const eventName = req.body.eventName;
    const eventDate = req.body.eventDate;
    const description = req.body.description;
    const website = req.body.website;

    let emailTransporter = await createEmailTransporter();

    let emailOptions = {
      subject: "One Time Code for Activate Account",
      to: req.body.email,
      from,

      html: `
      Hello,<br>
      Email: ${email}<br>
      Name: ${eventName}<br>
      Date: ${eventDate}<br>
      Description: ${description}<br>
      Website: ${website}
      `,
    };
    const response = await emailTransporter.sendMail(emailOptions);

    if (!response) {
      throw new APIError(422, "422", "Email sending failed.");
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
