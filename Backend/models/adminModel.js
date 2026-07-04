// ============================================
// AI Smart Bus Tracking and Notification System
// Admin Model
// models/adminModel.js
// ============================================

const db = require("../config/db");

// Get Dashboard Statistics
const getDashboard = (callback) => {

    const sql = `
        SELECT
            (SELECT COUNT(*) FROM students) AS totalStudents,
            (SELECT COUNT(*) FROM drivers) AS totalDrivers,
            (SELECT COUNT(*) FROM buses) AS totalBuses,
            (SELECT COUNT(*) FROM routes) AS totalRoutes,
            (SELECT COUNT(*) FROM notifications) AS totalNotifications
    `;

    db.query(sql, callback);

};

// Get All Admins
const getAllAdmins = (callback) => {

    const sql = "SELECT * FROM admins";

    db.query(sql, callback);

};

// Get Admin By ID
const getAdminById = (id, callback) => {

    const sql = "SELECT * FROM admins WHERE admin_id = ?";

    db.query(sql, [id], callback);

};

// Add New Admin
const addAdmin = (admin, callback) => {

    const sql = `
        INSERT INTO admins
        (name, email, password)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [
        admin.name,
        admin.email,
        admin.password
    ], callback);

};

// Update Admin
const updateAdmin = (id, admin, callback) => {

    const sql = `
        UPDATE admins
        SET
            name = ?,
            email = ?,
            password = ?
        WHERE admin_id = ?
    `;

    db.query(sql, [
        admin.name,
        admin.email,
        admin.password,
        id
    ], callback);

};

// Delete Admin
const deleteAdmin = (id, callback) => {

    const sql = "DELETE FROM admins WHERE admin_id = ?";

    db.query(sql, [id], callback);

};

// Get All Users
const getAllUsers = (callback) => {

    const sql = `
        SELECT student_id AS id, name, email, 'Student' AS role
        FROM students

        UNION ALL

        SELECT driver_id AS id, name, email, 'Driver' AS role
        FROM drivers

        UNION ALL

        SELECT admin_id AS id, name, email, 'Admin' AS role
        FROM admins
    `;

    db.query(sql, callback);

};

// Export Functions
module.exports = {

    getDashboard,
    getAllAdmins,
    getAdminById,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    getAllUsers

};
