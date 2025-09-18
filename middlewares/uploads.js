// middlewares/uploads.js
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./uploads/products";
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  },
});

// use .fields() for multiple uploads
export const productUpload = multer({ storage }).fields([
  { name: "image", maxCount: 1 },       // main image
  { name: "gallery", maxCount: 3 },     // up to 3 gallery images
]);
