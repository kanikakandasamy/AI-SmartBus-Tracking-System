const db = require("../config/db");

// Get all routes
exports.getRoutes = (req, res) => {

    db.query("SELECT * FROM routes", (err, result) => {

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

// Get route by ID
exports.getRouteById = (req, res) => {

    db.query(
        "SELECT * FROM routes WHERE id=?",
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

// Add route
exports.addRoute = (req, res) => {

    const { route_name, source, destination } = req.body;

    db.query(
        "INSERT INTO routes(route_name,source,destination) VALUES(?,?,?)",
        [route_name, source, destination],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Route added successfully"
            });

        }
    );

};

// Update route
exports.updateRoute = (req, res) => {

    const { route_name, source, destination } = req.body;

    db.query(
        "UPDATE routes SET route_name=?, source=?, destination=? WHERE id=?",
        [route_name, source, destination, req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Route updated successfully"
            });

        }
    );

};

// Delete route
exports.deleteRoute = (req, res) => {

    db.query(
        "DELETE FROM routes WHERE id=?",
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
                message: "Route deleted successfully"
            });

        }
    );

};