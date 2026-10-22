// ============================================
// AI Smart Bus Tracking and Notification System
// Bus Fleet Controller
// controllers/busController.js
// ============================================

const db = require("../config/db");

// Get all buses
exports.getBuses = (req, res) => {
    const sql = `
        SELECT
            b.id,
            b.bus_number,
            b.driver_id,
            b.capacity,
            b.current_occupancy,
            b.status,
            d.name AS driver_name,
            r.route_name,
            b.created_at
        FROM buses b
        LEFT JOIN drivers d ON b.driver_id = d.id
        LEFT JOIN allocations a ON b.id = a.bus_id
        LEFT JOIN routes r ON a.route_id = r.id
        ORDER BY b.id ASC
    `;

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, count: result.length, data: result });
    });
};

// Get bus by ID
exports.getBusById = (req, res) => {
    const sql = `
        SELECT
            b.*,
            d.name AS driver_name,
            r.route_name
        FROM buses b
        LEFT JOIN drivers d ON b.driver_id = d.id
        LEFT JOIN allocations a ON b.id = a.bus_id
        LEFT JOIN routes r ON a.route_id = r.id
        WHERE b.id = ?
    `;

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "Bus not found" });
        }
        res.json({ success: true, data: result[0] });
    });
};

// Add bus
exports.addBus = (req, res) => {
    const { bus_number, driver_id = null, capacity = 50, current_occupancy = 0, status = "Active" } = req.body;

    if (!bus_number) {
        return res.status(400).json({ success: false, message: "Bus number is required" });
    }

    const sql = `
        INSERT INTO buses (bus_number, driver_id, capacity, current_occupancy, status)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [bus_number, driver_id || null, capacity, current_occupancy, status], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({
            success: true,
            message: "Bus added successfully",
            id: result.insertId
        });
    });
};

// Update bus (supports partial or complete field updates)
exports.updateBus = (req, res) => {
    const fields = [];
    const values = [];

    if (req.body.bus_number !== undefined) {
        fields.push("bus_number = ?");
        values.push(req.body.bus_number);
    }
    if (req.body.driver_id !== undefined) {
        fields.push("driver_id = ?");
        values.push(req.body.driver_id || null);
    }
    if (req.body.capacity !== undefined) {
        fields.push("capacity = ?");
        values.push(parseInt(req.body.capacity));
    }
    if (req.body.current_occupancy !== undefined) {
        fields.push("current_occupancy = ?");
        values.push(parseInt(req.body.current_occupancy));
    }
    if (req.body.status !== undefined) {
        fields.push("status = ?");
        values.push(req.body.status);
    }

    if (fields.length === 0) {
        return res.status(400).json({ success: false, message: "No fields provided to update" });
    }

    values.push(req.params.id);
    const sql = `UPDATE buses SET ${fields.join(", ")} WHERE id = ?`;

    db.query(sql, values, (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, message: "Bus updated successfully" });
    });
};

// Delete bus
exports.deleteBus = (req, res) => {
    db.query("DELETE FROM buses WHERE id = ?", [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, message: "Bus deleted successfully" });
    });
};