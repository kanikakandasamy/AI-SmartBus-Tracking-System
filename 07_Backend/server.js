// ============================================
// AI Smart Bus Tracking and Notification System
// Main Server File
// server.js
// ============================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Database Connection
require("./config/db");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Frontend Static Assets
app.use(express.static(path.join(__dirname, "../03_Frontend")));

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
const etaRoutes = require("./routes/etaRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/allocations", allocationRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/eta", etaRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health Check Route
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "AI Smart Bus Tracking API is Running 🚍",
        version: "2.4.0",
        uptime: process.uptime()
    });
});

// Fallback for non-API routes to index.html if file not found
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../03_Frontend/index.html"));
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

// Start Server
const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚍 AI Smart Bus Tracking & Notification System Running`);
    console.log(`📡 Server Address: http://localhost:${PORT}`);
    console.log(`🗺️ Web App Interface: http://localhost:${PORT}/index.html`);
    console.log(`⚡ Live Telemetry Stream: http://localhost:${PORT}/api/tracking/stream`);
    console.log(`🤖 Advanced AI ETA Engine: http://localhost:${PORT}/api/eta`);
    console.log(`======================================================\n`);
});