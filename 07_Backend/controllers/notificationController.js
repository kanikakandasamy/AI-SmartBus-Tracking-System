// ============================================
// AI Smart Bus Tracking and Notification System
// Notification Controller
// controllers/notificationController.js
// ============================================

const db = require("../config/db");

// Get all notifications
exports.getNotifications = (req, res) => {
    const sql = `
        SELECT
            n.id,
            n.bus_id,
            b.bus_number,
            n.type,
            n.title,
            n.message,
            n.created_at
        FROM notifications n
        LEFT JOIN buses b ON n.bus_id = b.id
        ORDER BY n.id DESC
        LIMIT 50
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        res.json({
            success: true,
            count: result.length,
            data: result
        });
    });
};

// Add notification
exports.addNotification = (req, res) => {
    const { bus_id, type = "info", title = "Transit Advisory", message } = req.body;

    if (!message) {
        return res.status(400).json({
            success: false,
            message: "Message is required"
        });
    }

    const sql = `
        INSERT INTO notifications (bus_id, type, title, message)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [bus_id || null, type, title, message], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                error: err.message
            });
        }

        const newNotif = {
            id: result.insertId,
            bus_id,
            type,
            title,
            message,
            created_at: new Date().toISOString()
        };

        res.json({
            success: true,
            message: "Notification Broadcasted Successfully",
            data: newNotif
        });
    });
};

// Delete notification
exports.deleteNotification = (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM notifications WHERE id = ?", [id], (err) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, message: "Notification deleted" });
    });
};