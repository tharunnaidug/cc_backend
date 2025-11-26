// routes/authAdminRoutes.js
import express from "express";
import {
  registerAdmin,
  loginAdmin,
  getAdminMe,
} from "../controllers/adminAuthController.js";
import { adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// later you can remove this and create admins directly in DB.
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/me", adminProtect, getAdminMe);

export default router;