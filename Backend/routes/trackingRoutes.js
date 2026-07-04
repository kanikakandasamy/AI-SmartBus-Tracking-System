// ============================================
// AI Smart Bus Tracking and Notification System
// Tracking Routes
// routes/trackingRoutes.js
// ============================================

const express = require("express");
const router = express.Router();

// Import Controller
const trackingController = require("../controllers/trackingController");

// ===============================
// Live Tracking Routes
// ===============================

// Get All Bus Locations
router.get("/", trackingController.getAllLocations);

// Get Bus Current Location
router.get("/bus/:busId", trackingController.getBusLocation);

// Update Bus Location
router.put("/bus/:busId", trackingController.updateBusLocation);

// Get Bus Live Status
router.get("/bus/:busId/status", trackingController.getBusStatus);

// Get Estimated Arrival Time (ETA)
router.get("/bus/:busId/eta", trackingController.getEstimatedArrival);

// Get Route Tracking Details
router.get("/route/:routeId", trackingController.getRouteTracking);

// Export Router
module.exports = router;
