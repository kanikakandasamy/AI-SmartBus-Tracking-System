// ============================================
// AI Smart Bus Tracking and Notification System
// Route Routes
// routes/routeRoutes.js
// ============================================

const express = require("express");
const router = express.Router();

// Import Controller
const routeController = require("../controllers/routeController");

// ===============================
// Route APIs
// ===============================

// Get All Routes
router.get("/", routeController.getAllRoutes);

// Get Route By ID
router.get("/:id", routeController.getRouteById);

// Add New Route
router.post("/", routeController.addRoute);

// Update Route
router.put("/:id", routeController.updateRoute);

// Delete Route
router.delete("/:id", routeController.deleteRoute);

// Get Bus Stops for a Route
router.get("/:id/stops", routeController.getRouteStops);

// Get Buses Assigned to a Route
router.get("/:id/buses", routeController.getRouteBuses);

// Export Router
module.exports = router;
