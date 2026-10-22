// ============================================
// AI Smart Bus Tracking and Notification System
// Main Server File
// server.js
// ============================================

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const express = require("express");
const cors = require("cors");

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

// Helper to find local LAN IP for mobile phone access
const os = require("os");
function getLocalNetworkIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            if (net.family === "IPv4" && !net.internal) {
                return net.address;
            }
        }
    }
    return "localhost";
}

// Start Server
const PORT = process.env.PORT || 5002;
const localIp = getLocalNetworkIp();

app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n======================================================`);
    console.log(`🚍 AI Smart Bus Tracking & Notification System Running`);
    console.log(`📡 Local Computer:    http://localhost:${PORT}`);
    console.log(`📱 Mobile (Same Wi-Fi): http://${localIp}:${PORT}`);
    console.log(`🗺️ Web App Interface: http://localhost:${PORT}/index.html`);
    console.log(`👨‍✈️ Driver Cockpit:   http://${localIp}:${PORT}/driver.html`);
    console.log(`⚡ Live Telemetry:    http://localhost:${PORT}/api/tracking/stream`);
    console.log(`🤖 Advanced AI ETA:   http://localhost:${PORT}/api/eta`);
    console.log(`======================================================\n`);
});