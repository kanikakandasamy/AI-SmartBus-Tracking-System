// ============================================
// AI Smart Bus Tracking and Notification System
// Notification Model
// models/notificationModel.js
// ============================================

const db = require("../config/db");

// Get All Notifications
const getAllNotifications = (callback) => {

    const sql = `
        SELECT *
        FROM notifications
        ORDER BY created_at DESC
    `;

    db.query(sql, callback);

};

// Get Notification By ID
const getNotificationById = (id, callback) => {

    const sql = `
        SELECT *
        FROM notifications
        WHERE notification_id = ?
    `;

    db.query(sql, [id], callback);

};

// Create Notification
const createNotification = (notification, callback) => {

    const sql = `
        INSERT INTO notifications
        (title, message, type, status)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [
        notification.title,
        notification.message,
        notification.type,
        notification.status
    ], callback);

};

// Update Notification
const updateNotification = (id, notification, callback) => {

    const sql = `
        UPDATE notifications
        SET
            title = ?,
            message = ?,
            type = ?,
            status = ?
        WHERE notification_id = ?
    `;

    db.query(sql, [
        notification.title,
        notification.message,
        notification.type,
        notification.status,
        id
    ], callback);

};

// Delete Notification
const deleteNotification = (id, callback) => {

    const sql = `
        DELETE FROM notifications
        WHERE notification_id = ?
    `;

    db.query(sql, [id], callback);

};

// Get Notifications By Student
const getStudentNotifications = (studentId, callback) => {

    const sql = `
        SELECT
            n.notification_id,
            n.title,
            n.message,
            n.type,
            n.status,
            n.created_at
        FROM notifications n
        INNER JOIN students s
            ON n.bus_id = s.bus_id
        WHERE s.student_id = ?
        ORDER BY n.created_at DESC
    `;

    db.query(sql, [studentId], callback);

};

// Mark Notification As Read
const markAsRead = (id, callback) => {

    const sql = `
        UPDATE notifications
        SET status = 'Read'
        WHERE notification_id = ?
    `;

    db.query(sql, [id], callback);

};

// Export Functions
module.exports = {

    getAllNotifications,
    getNotificationById,
    createNotification,
    updateNotification,
    deleteNotification,
    getStudentNotifications,
    markAsRead

};
