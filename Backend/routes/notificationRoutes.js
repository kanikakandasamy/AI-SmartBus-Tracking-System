// ============================================
// AI Smart Bus Tracking and Notification System
// Notification Routes
// routes/notificationRoutes.js
// ============================================

const express = require("express");
const router = express.Router();

// Import Controller
const notificationController = require("../controllers/notificationController");

// ===============================
// Notification Routes
// ===============================

// Get All Notifications
router.get("/", notificationController.getAllNotifications);

// Get Notification By ID
router.get("/:id", notificationController.getNotificationById);

// Create Notification
router.post("/", notificationController.createNotification);

// Update Notification
router.put("/:id", notificationController.updateNotification);

// Delete Notification
router.delete("/:id", notificationController.deleteNotification);

// Get Notifications for a Student
router.get("/student/:studentId", notificationController.getStudentNotifications);

// Mark Notification as Read
router.put("/:id/read", notificationController.markAsRead);

// Export Router
module.exports = router;
