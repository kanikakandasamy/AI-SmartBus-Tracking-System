// ============================================
// AI Smart Bus Tracking and Notification System
// Student Model
// models/studentModel.js
// ============================================

const db = require("../config/db");

// Get All Students
const getAllStudents = (callback) => {

    const sql = "SELECT * FROM students";

    db.query(sql, callback);

};

// Get Student By ID
const getStudentById = (id, callback) => {

    const sql = "SELECT * FROM students WHERE student_id = ?";

    db.query(sql, [id], callback);

};

// Add New Student
const addStudent = (student, callback) => {

    const sql = `
        INSERT INTO students
        (name, email, department, year, phone, bus_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        student.name,
        student.email,
        student.department,
        student.year,
        student.phone,
        student.bus_id
    ], callback);

};

// Update Student
const updateStudent = (id, student, callback) => {

    const sql = `
        UPDATE students
        SET
            name = ?,
            email = ?,
            department = ?,
            year = ?,
            phone = ?,
            bus_id = ?
        WHERE student_id = ?
    `;

    db.query(sql, [
        student.name,
        student.email,
        student.department,
        student.year,
        student.phone,
        student.bus_id,
        id
    ], callback);

};

// Delete Student
const deleteStudent = (id, callback) => {

    const sql = "DELETE FROM students WHERE student_id = ?";

    db.query(sql, [id], callback);

};

// Get Student Bus Details
const getStudentBus = (id, callback) => {

    const sql = `
        SELECT
            s.student_id,
            s.name,
            b.bus_number,
            b.bus_name,
            r.route_name
        FROM students s
        LEFT JOIN buses b
            ON s.bus_id = b.bus_id
        LEFT JOIN routes r
            ON b.route_id = r.route_id
        WHERE s.student_id = ?
    `;

    db.query(sql, [id], callback);

};

// Export All Functions
module.exports = {

    getAllStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentBus

};
