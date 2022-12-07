const path = require("path");
const multer = require("multer");

// // // multer storage for storing locally
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/images/uploads");
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, file.fieldname + "-" + uniqueSuffix + ext);
//   },
// });

// multer storage
const storage = multer.diskStorage({});

// multer filter
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(new Error("File type is not supported"), false);
  }
};

exports.upload = multer({ storage, fileFilter });
