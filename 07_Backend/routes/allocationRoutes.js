const express = require("express");
const router = express.Router();

const allocationController = require("../controllers/allocationController");

// Get all allocations
router.get("/", allocationController.getAllocations);

// Get allocation by ID
router.get("/:id", allocationController.getAllocationById);

// Add allocation
router.post("/", allocationController.addAllocation);

// Update allocation
router.put("/:id", allocationController.updateAllocation);

// Delete allocation
router.delete("/:id", allocationController.deleteAllocation);

module.exports = router;