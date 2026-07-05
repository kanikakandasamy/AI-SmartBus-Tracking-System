// ============================================
// AI Smart Bus Tracking and Notification System
// Main Server File
// server.js
// ============================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Database Connection
require("./config/db");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const driverRoutes = require("./routes/driverRoutes");
const adminRoutes = require("./routes/adminRoutes");
const busRoutes = require("./routes/busRoutes");
const routeRoutes = require("./routes/routeRoutes");
const allocationRoutes = require("./routes/allocationRoutes");
const trackingRoutes = require("./routes/trackingRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/allocations", allocationRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/notifications", notificationRoutes);

// Home Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "AI Smart Bus Tracking API is Running 🚍"
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
