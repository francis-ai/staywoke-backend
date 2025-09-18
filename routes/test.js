import express from "express";
import { addProduct, getProducts, updateProduct, deleteProduct, getProductById } from "../controllers/productController.js";
import { productUpload } from "../middlewares/uploads.js";

const router = express.Router();

router.post("/", productUpload.single("image"), addProduct);
router.get("/", getProducts);
router.get("/:id", getProductById); // <-- NEW
router.put("/:id", productUpload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
