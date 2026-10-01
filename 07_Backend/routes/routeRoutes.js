const express = require("express");
const router = express.Router();

const routeController = require("../controllers/routeController");

// Get all routes
router.get("/", routeController.getRoutes);

// Get one route
router.get("/:id", routeController.getRouteById);

// Add route
router.post("/", routeController.addRoute);

// Update route
router.put("/:id", routeController.updateRoute);

// Delete route
router.delete("/:id", routeController.deleteRoute);

module.exports = router;