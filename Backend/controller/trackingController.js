// ============================================
// AI Smart Bus Tracking and Notification System
// Tracking Controller
// controllers/trackingController.js
// ============================================

// Get All Bus Locations
exports.getAllLocations = (req, res) => {

    res.status(200).json({
        success: true,
        message: "All bus locations retrieved successfully.",
        data: [
            {
                busId: 1,
                busNumber: "TN38AB1234",
                latitude: 11.0168,
                longitude: 76.9558,
                location: "Anna Nagar",
                speed: "40 km/h",
                status: "On Time"
            },
            {
                busId: 2,
                busNumber: "TN38CD5678",
                latitude: 11.0256,
                longitude: 76.9625,
                location: "Railway Station",
                speed: "35 km/h",
                status: "Delayed"
            }
        ]
    });

};

// Get Current Bus Location
exports.getBusLocation = (req, res) => {

    const { busId } = req.params;

    res.status(200).json({
        success: true,
        message: "Bus location retrieved successfully.",
        data: {
            busId,
            latitude: 11.0168,
            longitude: 76.9558,
            location: "Anna Nagar",
            speed: "40 km/h"
        }
    });

};

// Update Bus Location
exports.updateBusLocation = (req, res) => {

    const { busId } = req.params;
    const { latitude, longitude } = req.body;

    res.status(200).json({
        success: true,
        message: "Bus location updated successfully.",
        data: {
            busId,
            latitude,
            longitude
        }
    });

};

// Get Bus Status
exports.getBusStatus = (req, res) => {

    const { busId } = req.params;

    res.status(200).json({
        success: true,
        message: "Bus status retrieved successfully.",
        data: {
            busId,
            status: "On Time"
        }
    });

};

// Get Estimated Arrival Time (ETA)
exports.getEstimatedArrival = (req, res) => {

    const { busId } = req.params;

    res.status(200).json({
        success: true,
        message: "Estimated arrival time retrieved successfully.",
        data: {
            busId,
            eta: "12 Minutes"
        }
    });

};

// Get Route Tracking Details
exports.getRouteTracking = (req, res) => {

    const { routeId } = req.params;

    res.status(200).json({
        success: true,
        message: "Route tracking details retrieved successfully.",
        data: {
            routeId,
            routeName: "Route A",
            activeBuses: 2,
            currentLocations: [
                "Anna Nagar",
                "Main Bus Stop"
            ]
        }
    });

};
