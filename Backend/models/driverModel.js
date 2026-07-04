// ============================================
// AI Smart Bus Tracking and Notification System
// Driver Model
// models/driverModel.js
// ============================================

const db = require("../config/db");

// Get All Drivers
const getAllDrivers = (callback) => {

    const sql = "SELECT * FROM drivers";

    db.query(sql, callback);

};

// Get Driver By ID
const getDriverById = (id, callback) => {

    const sql = "SELECT * FROM drivers WHERE driver_id = ?";

    db.query(sql, [id], callback);

};

// Add New Driver
const addDriver = (driver, callback) => {

    const sql = `
        INSERT INTO drivers
        (name, email, phone, license_number, bus_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        driver.name,
        driver.email,
        driver.phone,
        driver.license_number,
        driver.bus_id
    ], callback);

};

// Update Driver
const updateDriver = (id, driver, callback) => {

    const sql = `
        UPDATE drivers
        SET
            name = ?,
            email = ?,
            phone = ?,
            license_number = ?,
            bus_id = ?
        WHERE driver_id = ?
    `;

    db.query(sql, [
        driver.name,
        driver.email,
        driver.phone,
        driver.license_number,
        driver.bus_id,
        id
    ], callback);

};

// Delete Driver
const deleteDriver = (id, callback) => {

    const sql = "DELETE FROM drivers WHERE driver_id = ?";

    db.query(sql, [id], callback);

};

// Get Driver Bus Details
const getDriverBus = (id, callback) => {

    const sql = `
        SELECT
            d.driver_id,
            d.name,
            b.bus_number,
            b.bus_name,
            r.route_name
        FROM drivers d
        LEFT JOIN buses b
            ON d.bus_id = b.bus_id
        LEFT JOIN routes r
            ON b.route_id = r.route_id
        WHERE d.driver_id = ?
    `;

    db.query(sql, [id], callback);

};

// Update Driver Location
const updateLocation = (id, latitude, longitude, callback) => {

    const sql = `
        UPDATE bus_locations
        SET
            latitude = ?,
            longitude = ?,
            updated_at = NOW()
        WHERE bus_id = (
            SELECT bus_id
            FROM drivers
            WHERE driver_id = ?
        )
    `;

    db.query(sql, [latitude, longitude, id], callback);

};

// Export Functions
module.exports = {

    getAllDrivers,
    getDriverById,
    addDriver,
    updateDriver,
    deleteDriver,
    getDriverBus,
    updateLocation

};
