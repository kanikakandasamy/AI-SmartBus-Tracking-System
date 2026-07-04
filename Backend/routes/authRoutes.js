// ============================================
// AI Smart Bus Tracking and Notification System
// Authentication Routes
// routes/authRoutes.js
// ============================================

const express = require("express");
const router = express.Router();

// Import Controller
const authController = require("../controllers/authController");

// ===============================
// Authentication Routes
// ===============================

// User Login
router.post("/login", authController.login);

// User Logout
router.post("/logout", authController.logout);

// Get User Profile
router.get("/profile", authController.getProfile);

// Export Router
module.exports = router;
