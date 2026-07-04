// ============================================
// AI Smart Bus Tracking and Notification System
// Allocation Routes
// routes/allocationRoutes.js
// ============================================

const express = require("express");
const router = express.Router();

// Import Controller
const allocationController = require("../controllers/allocationController");

// ===============================
// Bus Allocation Routes
// ===============================

// Get All Allocations
router.get("/", allocationController.getAllAllocations);

// Get Allocation By ID
router.get("/:id", allocationController.getAllocationById);

// Create New Allocation
router.post("/", allocationController.addAllocation);

// Update Allocation
router.put("/:id", allocationController.updateAllocation);

// Delete Allocation
router.delete("/:id", allocationController.deleteAllocation);

// Get Bus Allocation
router.get("/bus/:busId", allocationController.getAllocationByBus);

// Get Driver Allocation
router.get("/driver/:driverId", allocationController.getAllocationByDriver);

// Get Student Allocation
router.get("/student/:studentId", allocationController.getAllocationByStudent);

// Export Router
module.exports = router;
