// ============================================
// AI Smart Bus Tracking and Notification System
// Database Connection Pool with Auto-Reconnect
// config/db.js
// ============================================

const mysql = require("mysql2");

// Create MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "ai_smart_bus",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000
});

// Test connection on boot
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err.message);
        return;
    }
    console.log("✅ MySQL Database Connection Pool Established Successfully");
    connection.release();
});

// Export Connection Pool
module.exports = pool;