// ============================================
// AI Smart Bus Tracking and Notification System
// Multi-Role Authentication Controller
// controllers/authController.js
// ============================================

const db = require("../config/db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "smartbus_secret_key";

exports.login = (req, res) => {
    const { email, password, role = "admin" } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });
    }

    // Role-based target determination
    let table = "admins";
    let redirectUrl = "adminDashboard.html";

    if (role === "driver") {
        table = "drivers";
        redirectUrl = "driver.html";
    } else if (role === "student") {
        table = "students";
        redirectUrl = "dashboard.html";
    }

    const sql = `SELECT * FROM ${table} WHERE email = ? AND password = ? LIMIT 1`;

    db.query(sql, [email.trim(), password], (err, result) => {
        if (err) {
            console.error("Auth SQL Error:", err.message);
            return res.status(500).json({
                success: false,
                message: "Authentication error",
                error: err.message
            });
        }

        if (!result || result.length === 0) {
            // Also check all tables if specific role check missed
            return checkFallbackRoles(email, password, res);
        }

        const user = result[0];
        delete user.password; // Do not return raw password

        // Sign token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role || role, name: user.name },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            success: true,
            message: "Login successful",
            token,
            role: user.role || role,
            redirect: redirectUrl,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role || role,
                reg_no: user.reg_no || null,
                bus_id: user.bus_id || null,
                stop_name: user.stop_name || null
            }
        });
    });
};

// Fallback search across student and driver if role mismatch
function checkFallbackRoles(email, password, res) {
    db.query("SELECT *, 'student' AS detected_role FROM students WHERE email = ? AND password = ?", [email, password], (err, students) => {
        if (!err && students && students.length > 0) {
            const user = students[0];
            delete user.password;
            const token = jwt.sign({ id: user.id, email: user.email, role: "student", name: user.name }, JWT_SECRET, { expiresIn: "7d" });
            return res.json({
                success: true,
                message: "Login successful as Student",
                token,
                role: "student",
                redirect: "dashboard.html",
                user
            });
        }

        db.query("SELECT *, 'driver' AS detected_role FROM drivers WHERE email = ? AND password = ?", [email, password], (err2, drivers) => {
            if (!err2 && drivers && drivers.length > 0) {
                const user = drivers[0];
                delete user.password;
                const token = jwt.sign({ id: user.id, email: user.email, role: "driver", name: user.name }, JWT_SECRET, { expiresIn: "7d" });
                return res.json({
                    success: true,
                    message: "Login successful as Driver",
                    token,
                    role: "driver",
                    redirect: "driver.html",
                    user
                });
            }

            return res.status(401).json({
                success: false,
                message: "Invalid email or password. Please verify credentials."
            });
        });
    });
}

// Check current user session
exports.me = (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ success: false, message: "No session token provided" });
    }

    try {
        const token = authHeader.replace("Bearer ", "");
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ success: true, user: decoded });
    } catch (err) {
        res.status(401).json({ success: false, message: "Session expired or invalid" });
    }
};