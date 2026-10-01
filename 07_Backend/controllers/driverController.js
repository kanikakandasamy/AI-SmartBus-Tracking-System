const db = require("../config/db");

// Get all drivers
exports.getDrivers = (req, res) => {
    const sql = "SELECT * FROM drivers";

    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            data: result
        });
    });
};

// Get driver by ID
exports.getDriverById = (req, res) => {
    const sql = "SELECT * FROM drivers WHERE id = ?";

    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            data: result[0]
        });
    });
};

// Add driver
exports.addDriver = (req, res) => {

    const { name, phone, license_no, email, password } = req.body;

    const sql = `
        INSERT INTO drivers
        (name, phone, license_no, email, password)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, phone, license_no, email, password],
        (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Driver added successfully"
            });
        }
    );
};

// Update driver
exports.updateDriver = (req, res) => {

    const { name, phone, license_no, email, password } = req.body;

    const sql = `
        UPDATE drivers
        SET
            name = ?,
            phone = ?,
            license_no = ?,
            email = ?,
            password = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [name, phone, license_no, email, password, req.params.id],
        (err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Driver updated successfully"
            });
        }
    );
};

// Delete driver
exports.deleteDriver = (req, res) => {

    const sql = "DELETE FROM drivers WHERE id = ?";

    db.query(sql, [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            message: "Driver deleted successfully"
        });
    });
};