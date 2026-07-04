// ============================================
// AI Smart Bus Tracking and Notification System
// Authentication Controller
// controllers/authController.js
// ============================================

// Login
exports.login = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.status(400).json({
            success: false,
            message: "Email and Password are required."
        });

    }

    // Demo Login (Replace with database authentication later)
    res.status(200).json({
        success: true,
        message: "Login Successful",
        user: {
            id: 1,
            name: "Kanika Kandasamy",
            email: email,
            role: "Student"
        }
    });

};

// Logout
exports.logout = (req, res) => {

    res.status(200).json({
        success: true,
        message: "Logout Successful"
    });

};

// Get User Profile
exports.getProfile = (req, res) => {

    res.status(200).json({
        success: true,
        user: {
            id: 1,
            name: "Kanika Kandasamy",
            email: "kanika@example.com",
            role: "Student",
            department: "Computer Science",
            bus: "College Bus 01"
        }
    });

};
