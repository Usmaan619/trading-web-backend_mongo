import multer from "multer";

const storage = multer.memoryStorage();
console.log("storage: ", storage);
const upload = multer({ storage: storage });
console.log("upload: ", upload);

export const fileParser = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) res.json({ success: false, message: err.message });
    next();
  });
};

// const storage = multer.memoryStorage();
// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 10 * 1024 * 1024, // Set file size limit to 10MB
//   },
// });

// export const fileParser = (req, res, next) => {
//   upload.any()(req, res, (err) => {
//     if (err) {
//       return res.status(400).json({ success: false, message: err.message });
//     }
//     next();
//   });
// };

