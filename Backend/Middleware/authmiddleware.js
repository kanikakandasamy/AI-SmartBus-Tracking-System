// ============================================
// AI Smart Bus Tracking and Notification System
// Authentication Middleware
// middleware/authMiddleware.js
// ============================================

const jwt = require("jsonwebtoken");

// Verify JWT Token
const verifyToken = (req, res, next) => {

    // Get Token from Header
    const token = req.header("Authorization");

    // Check if Token Exists
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Access Denied. No Token Provided."
        });
    }

    try {

        // Remove 'Bearer ' from Token
        const actualToken = token.startsWith("Bearer ")
            ? token.slice(7)
            : token;

        // Verify Token
        const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);

        // Store User Information
        req.user = decoded;

        // Continue to Next Function
        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token."
        });

    }

};

// Check Admin Role
const isAdmin = (req, res, next) => {

    if (req.user.role !== "Admin") {

        return res.status(403).json({
            success: false,
            message: "Access Denied. Admin Only."
        });

    }

    next();

};

// Check Driver Role
const isDriver = (req, res, next) => {

    if (req.user.role !== "Driver") {

        return res.status(403).json({
            success: false,
            message: "Access Denied. Driver Only."
        });

    }

    next();

};

// Check Student Role
const isStudent = (req, res, next) => {

    if (req.user.role !== "Student") {

        return res.status(403).json({
            success: false,
            message: "Access Denied. Student Only."
        });

    }

    next();

};

// Export Middleware
module.exports = {

    verifyToken,
    isAdmin,
    isDriver,
    isStudent

};
