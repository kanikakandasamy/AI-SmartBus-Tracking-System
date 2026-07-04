// ============================================
// AI Smart Bus Tracking and Notification System
// Driver Controller
// controllers/driverController.js
// ============================================

// Get All Drivers
exports.getAllDrivers = (req, res) => {

    res.status(200).json({
        success: true,
        message: "Drivers retrieved successfully.",
        data: [
            {
                id: 1,
                name: "Ramesh Kumar",
                phone: "9876543210",
                licenseNumber: "DL123456789",
                assignedBus: "College Bus 01"
            },
            {
                id: 2,
                name: "Suresh Babu",
                phone: "9876543211",
                licenseNumber: "DL987654321",
                assignedBus: "College Bus 02"
            }
        ]
    });

};

// Get Driver By ID
exports.getDriverById = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: "Driver retrieved successfully.",
        data: {
            id: id,
            name: "Ramesh Kumar",
            phone: "9876543210",
            licenseNumber: "DL123456789",
            assignedBus: "College Bus 01"
        }
    });

};

// Add New Driver
exports.addDriver = (req, res) => {

    const { name, phone, licenseNumber } = req.body;

    res.status(201).json({
        success: true,
        message: "Driver added successfully.",
        data: {
            name,
            phone,
            licenseNumber
        }
    });

};

// Update Driver
exports.updateDriver = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: `Driver with ID ${id} updated successfully.`
    });

};

// Delete Driver
exports.deleteDriver = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: `Driver with ID ${id} deleted successfully.`
    });

};

// Get Driver Bus Details
exports.getDriverBus = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: "Driver bus details retrieved successfully.",
        data: {
            driverId: id,
            busNumber: "TN 38 AB 1234",
            busName: "College Bus 01",
            route: "Route A"
        }
    });

};

// Update Driver Location
exports.updateLocation = (req, res) => {

    const { id } = req.params;
    const { latitude, longitude } = req.body;

    res.status(200).json({
        success: true,
        message: "Driver location updated successfully.",
        data: {
            driverId: id,
            latitude,
            longitude
        }
    });

};
