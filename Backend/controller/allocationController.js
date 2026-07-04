// ============================================
// AI Smart Bus Tracking and Notification System
// Allocation Controller
// controllers/allocationController.js
// ============================================

// Get All Allocations
exports.getAllAllocations = (req, res) => {

    res.status(200).json({
        success: true,
        message: "Bus allocations retrieved successfully.",
        data: [
            {
                allocationId: 1,
                busId: 1,
                busNumber: "TN38AB1234",
                driverId: 1,
                driverName: "Ramesh Kumar",
                routeId: 1,
                routeName: "Route A"
            },
            {
                allocationId: 2,
                busId: 2,
                busNumber: "TN38CD5678",
                driverId: 2,
                driverName: "Suresh Babu",
                routeId: 2,
                routeName: "Route B"
            }
        ]
    });

};

// Get Allocation By ID
exports.getAllocationById = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: "Allocation retrieved successfully.",
        data: {
            allocationId: id,
            busId: 1,
            driverId: 1,
            routeId: 1
        }
    });

};

// Add New Allocation
exports.addAllocation = (req, res) => {

    const { busId, driverId, routeId } = req.body;

    res.status(201).json({
        success: true,
        message: "Bus allocation created successfully.",
        data: {
            busId,
            driverId,
            routeId
        }
    });

};

// Update Allocation
exports.updateAllocation = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: `Allocation with ID ${id} updated successfully.`
    });

};

// Delete Allocation
exports.deleteAllocation = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: `Allocation with ID ${id} deleted successfully.`
    });

};

// Get Allocation By Bus
exports.getAllocationByBus = (req, res) => {

    const { busId } = req.params;

    res.status(200).json({
        success: true,
        message: "Bus allocation retrieved successfully.",
        data: {
            busId,
            driverName: "Ramesh Kumar",
            routeName: "Route A"
        }
    });

};

// Get Allocation By Driver
exports.getAllocationByDriver = (req, res) => {

    const { driverId } = req.params;

    res.status(200).json({
        success: true,
        message: "Driver allocation retrieved successfully.",
        data: {
            driverId,
            busNumber: "TN38AB1234",
            routeName: "Route A"
        }
    });

};

// Get Allocation By Student
exports.getAllocationByStudent = (req, res) => {

    const { studentId } = req.params;

    res.status(200).json({
        success: true,
        message: "Student bus allocation retrieved successfully.",
        data: {
            studentId,
            busNumber: "TN38AB1234",
            driverName: "Ramesh Kumar",
            routeName: "Route A"
        }
    });

};
