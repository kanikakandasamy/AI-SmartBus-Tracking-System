// ============================================
// AI Smart Bus Tracking and Notification System
// Student Routes
// routes/studentRoutes.js
// ============================================

const express = require("express");
const router = express.Router();

// Import Controller
const studentController = require("../controllers/studentController");

// ===============================
// Student Routes
// ===============================

// Get All Students
router.get("/", studentController.getAllStudents);

// Get Student By ID
router.get("/:id", studentController.getStudentById);

// Add New Student
router.post("/", studentController.addStudent);

// Update Student
router.put("/:id", studentController.updateStudent);

// Delete Student
router.delete("/:id", studentController.deleteStudent);

// Get Student Bus Details
router.get("/:id/bus", studentController.getStudentBus);

// Export Router
module.exports = router;
