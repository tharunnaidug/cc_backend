// routes/commentRoutes.js
import express from "express";
import { userProtect } from "../middleware/authMiddleware.js";
import {
  getCommentsForPost,
  addCommentToPost,
} from "../controllers/commentController.js";

const router = express.Router({ mergeParams: true });

// /api/posts/:postId/comments
router.get("/", userProtect, getCommentsForPost);
router.post("/", userProtect, addCommentToPost);

export default router;
