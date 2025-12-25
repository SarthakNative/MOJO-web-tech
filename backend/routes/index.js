import express from "express";
import authRoutes from "./authRoutes.js";
import instagramRoutes from "./instagramRoutes.js";
import { userController } from "../controllers/userController.js";

const router = express.Router();

// Main routes
router.get("/", userController.getRoot);

// Auth routes
router.use("/auth", authRoutes);

// Instagram API routes
router.use("/instagram", instagramRoutes);


export default router;