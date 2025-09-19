import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "staywoke/products", // where files go in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

// Multer middleware
export const productUpload = multer({ storage }).fields([
  { name: "image", maxCount: 1 },   // single main image
  { name: "gallery", maxCount: 3 }, // up to 3 gallery images
]);
