const express = require("express");
const router = express.Router();

const etaController = require("../controllers/etaController");

// Get ETA for all active buses
router.get("/", etaController.getETA);

// Get detailed ETA for a specific bus
router.get("/:busId", etaController.getETAByBusId);

// Interactive ETA Simulation
router.post("/simulate", etaController.simulateETA);

module.exports = router;