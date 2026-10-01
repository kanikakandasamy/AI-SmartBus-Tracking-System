const db = require("../config/db");

// Dashboard Statistics
exports.getDashboard = (req, res) => {
    res.json({
        success: true,
        message: "Admin Dashboard Controller Working"
    });
};