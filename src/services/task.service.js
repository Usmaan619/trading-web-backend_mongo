const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const crypto = require("crypto");
const path = require("path");
const router = express();

// Create a mongoose connection
const conn = mongoose.createConnection(process.env.MONGO_URI);

// Init gfs
let gfs;

conn.once("open", () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads"); // Collection to store files
});

// Create a storage engine using GridFsStorage
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads", // Collection name
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

// Upload file route
router.post("/upload", upload.single("file"), (req, res) => {
  res.json({ file: req.file });
});

// Download file route
router.get("/download/:filename", (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length) {
      return res.status(404).json({ error: "File not found" });
    }

    // Set the response headers to download the file
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  });
});
