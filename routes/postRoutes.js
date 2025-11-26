// routes/postRoutes.js
import express from "express";
import { userProtect } from "../middleware/authMiddleware.js";
import {
  getPosts,
  createPost,
  getPostById,
  toggleLikePost,
} from "../controllers/postController.js";

const router = express.Router();

// /api/posts
router.get("/",  getPosts);
router.post("/newpost", userProtect, createPost);

// /api/posts/:id
router.get("/:id",  getPostById);
router.post("/:id/like", userProtect, toggleLikePost);

export default router;
