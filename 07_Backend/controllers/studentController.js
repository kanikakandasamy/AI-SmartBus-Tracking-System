const db = require("../config/db");

// Get all students
exports.getStudents = (req, res) => {

    const sql = "SELECT * FROM students";

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

// Get student by ID
exports.getStudentById = (req, res) => {

    const sql = "SELECT * FROM students WHERE id = ?";

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

// Add student
exports.addStudent = (req, res) => {

    const { name, reg_no, email, password, bus_id } = req.body;

    const sql = `
        INSERT INTO students
        (name, reg_no, email, password, bus_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, reg_no, email, password, bus_id],
        (err) => {

            if (err) {
    console.log(err);

    return res.status(500).json({
        success: false,
        message: err.message
    });
}

            res.json({
                success: true,
                message: "Student added successfully"
            });

        }
    );

};

// Update student
exports.updateStudent = (req, res) => {

    const { name, reg_no, email, password, bus_id } = req.body;

    const sql = `
        UPDATE students
        SET
            name=?,
            reg_no=?,
            email=?,
            password=?,
            bus_id=?
        WHERE id=?
    `;

    db.query(
        sql,
        [name, reg_no, email, password, bus_id, req.params.id],
        (err) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Student updated successfully"
            });

        }
    );

};

// Delete student
exports.deleteStudent = (req, res) => {

    const sql = "DELETE FROM students WHERE id=?";

    db.query(sql, [req.params.id], (err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message
            });
        }

        res.json({
            success: true,
            message: "Student deleted successfully"
        });

    });

};