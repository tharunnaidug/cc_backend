// routes/projectRoutes.js
import express from "express";
import { userProtect } from "../middleware/authMiddleware.js";
import {
  getProjects,
  createProject,
  getProjectById,
  requestToJoin,
  handleJoinRequest,
} from "../controllers/projectController.js";

const router = express.Router();

// List projects (with filters) / Create project
router.get("/", userProtect, getProjects);
router.post("/newproject", userProtect, createProject);

// Single project
router.get("/:id", userProtect, getProjectById);

// Join requests
router.post("/:id/join", userProtect, requestToJoin);
router.post("/:id/requests/:requestId", userProtect, handleJoinRequest);

export default router;
