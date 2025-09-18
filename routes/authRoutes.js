import express from "express";
import { adminLogin, changePassword } from "../controllers/authController.js";
// import { protect } from "../middlewares/authMiddleware.js"; // Ensure folder is named 'middleware'

const router = express.Router();

// Login route (no auth needed)
router.post("/login", adminLogin);

// Change password (protected)
router.post("/change-password", changePassword);

export default router;
