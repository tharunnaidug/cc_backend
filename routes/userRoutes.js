// routes/userRoutes.js
import express from "express";
import { userProtect } from "../middleware/authMiddleware.js";
import { updateUserProfile } from "../controllers/userController.js";

const router = express.Router();

// PUT /api/users/me
router.put("/update", userProtect, updateUserProfile);

export default router;