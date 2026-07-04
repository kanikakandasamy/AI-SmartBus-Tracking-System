// ============================================
// AI Smart Bus Tracking and Notification System
// Tracking Model
// models/trackingModel.js
// ============================================

const db = require("../config/db");

// Get All Bus Locations
const getAllLocations = (callback) => {

    const sql = `
        SELECT
            bl.location_id,
            b.bus_id,
            b.bus_number,
            bl.latitude,
            bl.longitude,
            bl.speed,
            bl.updated_at
        FROM bus_locations bl
        INNER JOIN buses b
            ON bl.bus_id = b.bus_id
    `;

    db.query(sql, callback);

};

// Get Bus Location By Bus ID
const getBusLocation = (busId, callback) => {

    const sql = `
        SELECT
            b.bus_id,
            b.bus_number,
            bl.latitude,
            bl.longitude,
            bl.speed,
            bl.updated_at
        FROM buses b
        INNER JOIN bus_locations bl
            ON b.bus_id = bl.bus_id
        WHERE b.bus_id = ?
    `;

    db.query(sql, [busId], callback);

};

// Update Bus Location
const updateBusLocation = (busId, location, callback) => {

    const sql = `
        UPDATE bus_locations
        SET
            latitude = ?,
            longitude = ?,
            speed = ?,
            updated_at = NOW()
        WHERE bus_id = ?
    `;

    db.query(sql, [
        location.latitude,
        location.longitude,
        location.speed,
        busId
    ], callback);

};

// Get Bus Status
const getBusStatus = (busId, callback) => {

    const sql = `
        SELECT
            bus_id,
            status
        FROM buses
        WHERE bus_id = ?
    `;

    db.query(sql, [busId], callback);

};

// Get Estimated Arrival Time (ETA)
const getEstimatedArrival = (busId, callback) => {

    const sql = `
        SELECT
            bus_id,
            estimated_arrival
        FROM bus_locations
        WHERE bus_id = ?
    `;

    db.query(sql, [busId], callback);

};

// Get Route Tracking
const getRouteTracking = (routeId, callback) => {

    const sql = `
        SELECT
            r.route_name,
            b.bus_number,
            bl.latitude,
            bl.longitude,
            bl.speed,
            bl.updated_at
        FROM routes r
        INNER JOIN buses b
            ON r.route_id = b.route_id
        INNER JOIN bus_locations bl
            ON b.bus_id = bl.bus_id
        WHERE r.route_id = ?
    `;

    db.query(sql, [routeId], callback);

};

// Export Functions
module.exports = {

    getAllLocations,
    getBusLocation,
    updateBusLocation,
    getBusStatus,
    getEstimatedArrival,
    getRouteTracking

};
