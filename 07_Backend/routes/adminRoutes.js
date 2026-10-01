const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

// Admin Dashboard
router.get("/", adminController.getDashboard);

module.exports = router;