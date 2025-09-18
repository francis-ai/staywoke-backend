// routes/productRoutes.js
import express from "express";
import { addProduct, getProducts, updateProduct, deleteProduct, getProductById } from "../controllers/productController.js";
import { productUpload } from "../middlewares/uploads.js";

const router = express.Router();

router.post("/", productUpload, addProduct);
router.put("/:id", productUpload, updateProduct);

router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);

export default router;
