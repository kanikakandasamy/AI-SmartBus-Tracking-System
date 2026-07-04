// ============================================
// AI Smart Bus Tracking and Notification System
// Notification Controller
// controllers/notificationController.js
// ============================================

// Get All Notifications
exports.getAllNotifications = (req, res) => {

    res.status(200).json({
        success: true,
        message: "Notifications retrieved successfully.",
        data: [
            {
                id: 1,
                title: "Bus Delayed",
                message: "College Bus 01 will arrive 10 minutes late.",
                type: "Delay",
                status: "Unread"
            },
            {
                id: 2,
                title: "Bus Arrived",
                message: "College Bus 02 has reached Anna Nagar Bus Stop.",
                type: "Arrival",
                status: "Read"
            }
        ]
    });

};

// Get Notification By ID
exports.getNotificationById = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: "Notification retrieved successfully.",
        data: {
            id: id,
            title: "Bus Delayed",
            message: "College Bus 01 will arrive 10 minutes late.",
            type: "Delay",
            status: "Unread"
        }
    });

};

// Create Notification
exports.createNotification = (req, res) => {

    const { title, message, type } = req.body;

    res.status(201).json({
        success: true,
        message: "Notification created successfully.",
        data: {
            title,
            message,
            type
        }
    });

};

// Update Notification
exports.updateNotification = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: `Notification with ID ${id} updated successfully.`
    });

};

// Delete Notification
exports.deleteNotification = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: `Notification with ID ${id} deleted successfully.`
    });

};

// Get Student Notifications
exports.getStudentNotifications = (req, res) => {

    const { studentId } = req.params;

    res.status(200).json({
        success: true,
        message: "Student notifications retrieved successfully.",
        data: [
            {
                id: 1,
                studentId,
                title: "Bus Delayed",
                message: "Your bus is delayed by 10 minutes.",
                status: "Unread"
            },
            {
                id: 2,
                studentId,
                title: "Bus Arrived",
                message: "Your bus has arrived at your boarding point.",
                status: "Read"
            }
        ]
    });

};

// Mark Notification as Read
exports.markAsRead = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: `Notification with ID ${id} marked as read.`
    });

};
