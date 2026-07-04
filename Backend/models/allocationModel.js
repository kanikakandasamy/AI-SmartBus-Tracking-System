// ============================================
// AI Smart Bus Tracking and Notification System
// Allocation Model
// models/allocationModel.js
// ============================================

const db = require("../config/db");

// Get All Allocations
const getAllAllocations = (callback) => {

    const sql = `
        SELECT
            ba.allocation_id,
            b.bus_number,
            b.bus_name,
            d.name AS driver_name,
            r.route_name
        FROM bus_allocations ba
        INNER JOIN buses b
            ON ba.bus_id = b.bus_id
        INNER JOIN drivers d
            ON ba.driver_id = d.driver_id
        INNER JOIN routes r
            ON ba.route_id = r.route_id
    `;

    db.query(sql, callback);

};

// Get Allocation By ID
const getAllocationById = (id, callback) => {

    const sql = `
        SELECT *
        FROM bus_allocations
        WHERE allocation_id = ?
    `;

    db.query(sql, [id], callback);

};

// Add New Allocation
const addAllocation = (allocation, callback) => {

    const sql = `
        INSERT INTO bus_allocations
        (bus_id, driver_id, route_id)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [
        allocation.bus_id,
        allocation.driver_id,
        allocation.route_id
    ], callback);

};

// Update Allocation
const updateAllocation = (id, allocation, callback) => {

    const sql = `
        UPDATE bus_allocations
        SET
            bus_id = ?,
            driver_id = ?,
            route_id = ?
        WHERE allocation_id = ?
    `;

    db.query(sql, [
        allocation.bus_id,
        allocation.driver_id,
        allocation.route_id,
        id
    ], callback);

};

// Delete Allocation
const deleteAllocation = (id, callback) => {

    const sql = `
        DELETE FROM bus_allocations
        WHERE allocation_id = ?
    `;

    db.query(sql, [id], callback);

};

// Get Allocation By Bus
const getAllocationByBus = (busId, callback) => {

    const sql = `
        SELECT *
        FROM bus_allocations
        WHERE bus_id = ?
    `;

    db.query(sql, [busId], callback);

};

// Get Allocation By Driver
const getAllocationByDriver = (driverId, callback) => {

    const sql = `
        SELECT *
        FROM bus_allocations
        WHERE driver_id = ?
    `;

    db.query(sql, [driverId], callback);

};

// Get Allocation By Student
const getAllocationByStudent = (studentId, callback) => {

    const sql = `
        SELECT
            s.student_id,
            s.name,
            b.bus_number,
            b.bus_name,
            d.name AS driver_name,
            r.route_name
        FROM students s
        INNER JOIN buses b
            ON s.bus_id = b.bus_id
        INNER JOIN bus_allocations ba
            ON b.bus_id = ba.bus_id
        INNER JOIN drivers d
            ON ba.driver_id = d.driver_id
        INNER JOIN routes r
            ON ba.route_id = r.route_id
        WHERE s.student_id = ?
    `;

    db.query(sql, [studentId], callback);

};

// Export Functions
module.exports = {

    getAllAllocations,
    getAllocationById,
    addAllocation,
    updateAllocation,
    deleteAllocation,
    getAllocationByBus,
    getAllocationByDriver,
    getAllocationByStudent

};
