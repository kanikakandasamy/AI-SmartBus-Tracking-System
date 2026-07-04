// ============================================
// AI Smart Bus Tracking and Notification System
// Admin Routes
// routes/adminRoutes.js
// ============================================

const express = require("express");
const router = express.Router();

// Import Controller
const adminController = require("../controllers/adminController");

// ===============================
// Admin Routes
// ===============================

// Get Dashboard Statistics
router.get("/dashboard", adminController.getDashboard);

// Get All Admins
router.get("/", adminController.getAllAdmins);

// Get Admin By ID
router.get("/:id", adminController.getAdminById);

// Add New Admin
router.post("/", adminController.addAdmin);

// Update Admin
router.put("/:id", adminController.updateAdmin);

// Delete Admin
router.delete("/:id", adminController.deleteAdmin);

// Manage Users
router.get("/users", adminController.getAllUsers);

// Export Router
module.exports = router;
