// ============================================
// AI Smart Bus Tracking and Notification System
// Admin Controller
// controllers/adminController.js
// ============================================

// Get Dashboard Statistics
exports.getDashboard = (req, res) => {

    res.status(200).json({
        success: true,
        message: "Dashboard statistics retrieved successfully.",
        data: {
            totalStudents: 250,
            totalDrivers: 15,
            totalBuses: 12,
            totalRoutes: 8,
            activeBuses: 10,
            notificationsSent: 45
        }
    });

};

// Get All Admins
exports.getAllAdmins = (req, res) => {

    res.status(200).json({
        success: true,
        message: "Admins retrieved successfully.",
        data: [
            {
                id: 1,
                name: "Admin One",
                email: "admin1@college.edu"
            },
            {
                id: 2,
                name: "Admin Two",
                email: "admin2@college.edu"
            }
        ]
    });

};

// Get Admin By ID
exports.getAdminById = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: "Admin retrieved successfully.",
        data: {
            id: id,
            name: "Admin One",
            email: "admin1@college.edu"
        }
    });

};

// Add New Admin
exports.addAdmin = (req, res) => {

    const { name, email } = req.body;

    res.status(201).json({
        success: true,
        message: "Admin added successfully.",
        data: {
            name,
            email
        }
    });

};

// Update Admin
exports.updateAdmin = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: `Admin with ID ${id} updated successfully.`
    });

};

// Delete Admin
exports.deleteAdmin = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: `Admin with ID ${id} deleted successfully.`
    });

};

// Get All Users
exports.getAllUsers = (req, res) => {

    res.status(200).json({
        success: true,
        message: "All users retrieved successfully.",
        data: {
            students: 250,
            drivers: 15,
            admins: 2
        }
    });

};
