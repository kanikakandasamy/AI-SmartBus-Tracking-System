// ============================================
// AI Smart Bus Tracking and Notification System
// Database Configuration
// config/db.js
// ============================================

const mysql = require("mysql2");
const dotenv = require("dotenv");

// Load Environment Variables
dotenv.config();

// Create Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to MySQL Database
db.connect((err) => {

    if (err) {

        console.error("Database Connection Failed!");
        console.error(err.message);
        return;

    }

    console.log("MySQL Database Connected Successfully.");

});

// Export Database Connection
module.exports = db;
