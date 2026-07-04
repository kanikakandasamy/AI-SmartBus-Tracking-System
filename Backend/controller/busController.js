// ============================================
// AI Smart Bus Tracking and Notification System
// Bus Controller
// controllers/busController.js
// ============================================

// Get All Buses
exports.getAllBuses = (req, res) => {

    res.status(200).json({
        success: true,
        message: "Buses retrieved successfully.",
        data: [
            {
                id: 1,
                busNumber: "TN38AB1234",
                busName: "College Bus 01",
                capacity: 50,
                status: "Active"
            },
            {
                id: 2,
                busNumber: "TN38CD5678",
                busName: "College Bus 02",
                capacity: 45,
                status: "Active"
            }
        ]
    });

};

// Get Bus By ID
exports.getBusById = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: "Bus retrieved successfully.",
        data: {
            id: id,
            busNumber: "TN38AB1234",
            busName: "College Bus 01",
            capacity: 50,
            status: "Active"
        }
    });

};

// Add New Bus
exports.addBus = (req, res) => {

    const { busNumber, busName, capacity } = req.body;

    res.status(201).json({
        success: true,
        message: "Bus added successfully.",
        data: {
            busNumber,
            busName,
            capacity
        }
    });

};

// Update Bus
exports.updateBus = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: `Bus with ID ${id} updated successfully.`
    });

};

// Delete Bus
exports.deleteBus = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: `Bus with ID ${id} deleted successfully.`
    });

};

// Get Live Bus Location
exports.getBusLocation = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: "Bus location retrieved successfully.",
        data: {
            busId: id,
            latitude: 11.0168,
            longitude: 76.9558,
            location: "Anna Nagar",
            speed: "40 km/h"
        }
    });

};

// Update Bus Location
exports.updateBusLocation = (req, res) => {

    const { id } = req.params;
    const { latitude, longitude } = req.body;

    res.status(200).json({
        success: true,
        message: "Bus location updated successfully.",
        data: {
            busId: id,
            latitude,
            longitude
        }
    });

};

// Get Assigned Route
exports.getBusRoute = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: "Bus route retrieved successfully.",
        data: {
            busId: id,
            routeName: "Route A",
            startPoint: "College Campus",
            endPoint: "Central Bus Stand"
        }
    });

};
