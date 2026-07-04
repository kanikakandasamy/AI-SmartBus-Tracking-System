// ============================================
// AI Smart Bus Tracking and Notification System
// Route Model
// models/routeModel.js
// ============================================

const db = require("../config/db");

// Get All Routes
const getAllRoutes = (callback) => {

    const sql = "SELECT * FROM routes";

    db.query(sql, callback);

};

// Get Route By ID
const getRouteById = (id, callback) => {

    const sql = "SELECT * FROM routes WHERE route_id = ?";

    db.query(sql, [id], callback);

};

// Add New Route
const addRoute = (route, callback) => {

    const sql = `
        INSERT INTO routes
        (route_name, start_point, end_point)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [
        route.route_name,
        route.start_point,
        route.end_point
    ], callback);

};

// Update Route
const updateRoute = (id, route, callback) => {

    const sql = `
        UPDATE routes
        SET
            route_name = ?,
            start_point = ?,
            end_point = ?
        WHERE route_id = ?
    `;

    db.query(sql, [
        route.route_name,
        route.start_point,
        route.end_point,
        id
    ], callback);

};

// Delete Route
const deleteRoute = (id, callback) => {

    const sql = "DELETE FROM routes WHERE route_id = ?";

    db.query(sql, [id], callback);

};

// Get Route Stops
const getRouteStops = (id, callback) => {

    const sql = `
        SELECT
            stop_id,
            stop_name,
            stop_order
        FROM bus_stops
        WHERE route_id = ?
        ORDER BY stop_order ASC
    `;

    db.query(sql, [id], callback);

};

// Get Buses Assigned to Route
const getRouteBuses = (id, callback) => {

    const sql = `
        SELECT
            bus_id,
            bus_number,
            bus_name,
            capacity,
            status
        FROM buses
        WHERE route_id = ?
    `;

    db.query(sql, [id], callback);

};

// Export Functions
module.exports = {

    getAllRoutes,
    getRouteById,
    addRoute,
    updateRoute,
    deleteRoute,
    getRouteStops,
    getRouteBuses

};
