const db = require("../config/db");

// Get all allocations
exports.getAllocations = (req, res) => {

    const sql = `
SELECT
    allocations.id,
    buses.bus_number,
    drivers.name AS driver_name,
    routes.route_name
FROM allocations
JOIN buses ON allocations.bus_id = buses.id
JOIN drivers ON allocations.driver_id = drivers.id
JOIN routes ON allocations.route_id = routes.id
ORDER BY allocations.id ASC;
`;
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

// Get allocation by ID
exports.getAllocationById = (req, res) => {

    db.query(
        "SELECT * FROM allocations WHERE id=?",
        [req.params.id],
        (err, result) => {

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

        }
    );

};

// Add allocation
exports.addAllocation = (req, res) => {

    const { bus_id, driver_id, route_id } = req.body;

    db.query(
        "INSERT INTO allocations(bus_id,driver_id,route_id) VALUES(?,?,?)",
        [bus_id, driver_id, route_id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Allocation added successfully"
            });

        }
    );

};

// Update allocation
exports.updateAllocation = (req, res) => {

    const { bus_id, driver_id, route_id } = req.body;

    db.query(
        "UPDATE allocations SET bus_id=?, driver_id=?, route_id=? WHERE id=?",
        [bus_id, driver_id, route_id, req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Allocation updated successfully"
            });

        }
    );

};

// Delete allocation
exports.deleteAllocation = (req, res) => {

    db.query(
        "DELETE FROM allocations WHERE id=?",
        [req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Allocation deleted successfully"
            });

        }
    );

};