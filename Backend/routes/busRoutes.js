// ============================================
// AI Smart Bus Tracking and Notification System
// Bus Routes
// routes/busRoutes.js
// ============================================

const express = require("express");
const router = express.Router();

// Import Controller
const busController = require("../controllers/busController");

// ===============================
// Bus Routes
// ===============================

// Get All Buses
router.get("/", busController.getAllBuses);

// Get Bus By ID
router.get("/:id", busController.getBusById);

// Add New Bus
router.post("/", busController.addBus);

// Update Bus
router.put("/:id", busController.updateBus);

// Delete Bus
router.delete("/:id", busController.deleteBus);

// Get Live Bus Location
router.get("/:id/location", busController.getBusLocation);

// Update Bus Location
router.put("/:id/location", busController.updateBusLocation);

// Get Bus Route
router.get("/:id/route", busController.getBusRoute);

// Export Router
module.exports = router;
