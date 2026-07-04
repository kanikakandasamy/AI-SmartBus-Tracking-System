// ============================================
// AI Smart Bus Tracking and Notification System
// Driver Routes
// routes/driverRoutes.js
// ============================================

const express = require("express");
const router = express.Router();

// Import Controller
const driverController = require("../controllers/driverController");

// ===============================
// Driver Routes
// ===============================

// Get All Drivers
router.get("/", driverController.getAllDrivers);

// Get Driver By ID
router.get("/:id", driverController.getDriverById);

// Add New Driver
router.post("/", driverController.addDriver);

// Update Driver
router.put("/:id", driverController.updateDriver);

// Delete Driver
router.delete("/:id", driverController.deleteDriver);

// Get Driver Bus Details
router.get("/:id/bus", driverController.getDriverBus);

// Update Driver Location
router.put("/:id/location", driverController.updateLocation);

// Export Router
module.exports = router;
