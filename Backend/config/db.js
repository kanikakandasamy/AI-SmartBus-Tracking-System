// ============================================
// AI Smart Bus Tracking and Notification System
// Database Connection
// config/db.js
// ============================================

const mysql = require("mysql2");

// Create MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Connect to Database
db.connect((err) => {

    if (err) {
        console.error("❌ Database Connection Failed:", err.message);
        return;
    }

    console.log("✅ MySQL Database Connected Successfully");

});

// Export Connection
module.exports = db;
