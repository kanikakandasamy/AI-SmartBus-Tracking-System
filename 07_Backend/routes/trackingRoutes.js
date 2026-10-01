const express = require("express");
const router = express.Router();

const trackingController = require("../controllers/trackingController");

// Real-Time Server-Sent Events (SSE) Stream
router.get("/stream", trackingController.streamTracking);

// Get all latest tracking positions
router.get("/", trackingController.getTracking);

// Get single bus tracking
router.get("/:busId", trackingController.getBusTracking);

// Update/Add bus location (transmits to all SSE listeners)
router.post("/", trackingController.updateTracking);

// Advance GPS coordinates along route simulation
router.post("/simulate-step", trackingController.simulateStep);

// Emergency SOS alert
router.post("/sos", trackingController.sendSOS);

module.exports = router;