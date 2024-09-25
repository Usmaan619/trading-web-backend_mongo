import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const fileParser = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) res.json({ success: false, message: err.message });
    next();
  });
};
