import express from "express";
import { fileParser } from "../middleware/file.handler.js";
import { upload } from "../services/s3.service.js";

const router = express();

router.post("/upload", fileParser, async (req, res, next) => {
  try {
    const data = await upload(req.files[0].buffer, req.body.filePath);
    res.json({
      status: true,
      data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
