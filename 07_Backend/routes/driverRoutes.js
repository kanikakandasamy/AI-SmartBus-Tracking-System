const express = require("express");
const router = express.Router();

const driverController = require("../controllers/driverController");

// Get all drivers
router.get("/", driverController.getDrivers);

// Get driver by ID
router.get("/:id", driverController.getDriverById);

// Add new driver
router.post("/", driverController.addDriver);

// Update driver
router.put("/:id", driverController.updateDriver);

// Delete driver
router.delete("/:id", driverController.deleteDriver);

module.exports = router;