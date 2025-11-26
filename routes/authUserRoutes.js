// routes/authUserRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  getUserMe,
} from "../controllers/userAuthController.js";
import { userProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", userProtect, getUserMe);

export default router;
