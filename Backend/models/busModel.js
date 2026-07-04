// ============================================
// AI Smart Bus Tracking and Notification System
// Bus Model
// models/busModel.js
// ============================================

const db = require("../config/db");

// Get All Buses
const getAllBuses = (callback) => {

    const sql = "SELECT * FROM buses";

    db.query(sql, callback);

};

// Get Bus By ID
const getBusById = (id, callback) => {

    const sql = "SELECT * FROM buses WHERE bus_id = ?";

    db.query(sql, [id], callback);

};

// Add New Bus
const addBus = (bus, callback) => {

    const sql = `
        INSERT INTO buses
        (bus_number, bus_name, capacity, route_id, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        bus.bus_number,
        bus.bus_name,
        bus.capacity,
        bus.route_id,
        bus.status
    ], callback);

};

// Update Bus
const updateBus = (id, bus, callback) => {

    const sql = `
        UPDATE buses
        SET
            bus_number = ?,
            bus_name = ?,
            capacity = ?,
            route_id = ?,
            status = ?
        WHERE bus_id = ?
    `;

    db.query(sql, [
        bus.bus_number,
        bus.bus_name,
        bus.capacity,
        bus.route_id,
        bus.status,
        id
    ], callback);

};

// Delete Bus
const deleteBus = (id, callback) => {

    const sql = "DELETE FROM buses WHERE bus_id = ?";

    db.query(sql, [id], callback);

};

// Get Live Bus Location
const getBusLocation = (id, callback) => {

    const sql = `
        SELECT
            b.bus_id,
            b.bus_number,
            bl.latitude,
            bl.longitude,
            bl.speed,
            bl.updated_at
        FROM buses b
        LEFT JOIN bus_locations bl
            ON b.bus_id = bl.bus_id
        WHERE b.bus_id = ?
    `;

    db.query(sql, [id], callback);

};

// Update Bus Location
const updateBusLocation = (id, latitude, longitude, callback) => {

    const sql = `
        UPDATE bus_locations
        SET
            latitude = ?,
            longitude = ?,
            updated_at = NOW()
        WHERE bus_id = ?
    `;

    db.query(sql, [latitude, longitude, id], callback);

};

// Get Assigned Route
const getBusRoute = (id, callback) => {

    const sql = `
        SELECT
            b.bus_id,
            b.bus_number,
            r.route_name,
            r.start_point,
            r.end_point
        FROM buses b
        LEFT JOIN routes r
            ON b.route_id = r.route_id
        WHERE b.bus_id = ?
    `;

    db.query(sql, [id], callback);

};

// Export Functions
module.exports = {

    getAllBuses,
    getBusById,
    addBus,
    updateBus,
    deleteBus,
    getBusLocation,
    updateBusLocation,
    getBusRoute

};
