import express from "express";
import { authController } from "../controllers/authController.js";

const router = express.Router();

/**
 * @route   GET /auth/instagram
 * @desc    Redirect to Instagram OAuth
 * @access  Public
 */
router.get("/instagram", authController.redirectToInstagramAuth);

/**
 * @route   GET /auth/instagram/callback
 * @desc    Handle Instagram OAuth callback
 * @access  Public
 */
router.get("/instagram/callback", authController.handleInstagramCallback);

/**
 * @route   POST /auth/logout
 * @desc    Logout user and clear tokens
 * @access  Public
 */
router.post("/logout", authController.logout);

/**
 * @route   GET /auth/status
 * @desc    Check authentication status
 * @access  Public
 */
router.get("/status", authController.checkAuthStatus);

export default router;