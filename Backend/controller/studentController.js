// ============================================
// AI Smart Bus Tracking and Notification System
// Student Controller
// controllers/studentController.js
// ============================================

// Get All Students
exports.getAllStudents = (req, res) => {

    res.status(200).json({
        success: true,
        message: "Students retrieved successfully.",
        data: [
            {
                id: 101,
                name: "Rahul Kumar",
                department: "Computer Science",
                year: "III",
                bus: "College Bus 01"
            },
            {
                id: 102,
                name: "Priya Sharma",
                department: "Information Technology",
                year: "II",
                bus: "College Bus 02"
            }
        ]
    });

};

// Get Student By ID
exports.getStudentById = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: "Student retrieved successfully.",
        data: {
            id: id,
            name: "Rahul Kumar",
            department: "Computer Science",
            year: "III",
            bus: "College Bus 01"
        }
    });

};

// Add New Student
exports.addStudent = (req, res) => {

    const { name, department, year } = req.body;

    res.status(201).json({
        success: true,
        message: "Student added successfully.",
        data: {
            name,
            department,
            year
        }
    });

};

// Update Student
exports.updateStudent = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: `Student with ID ${id} updated successfully.`
    });

};

// Delete Student
exports.deleteStudent = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: `Student with ID ${id} deleted successfully.`
    });

};

// Get Student Bus Details
exports.getStudentBus = (req, res) => {

    const { id } = req.params;

    res.status(200).json({
        success: true,
        message: "Student bus details retrieved successfully.",
        data: {
            studentId: id,
            busNumber: "TN 38 AB 1234",
            busName: "College Bus 01",
            driver: "Ramesh",
            route: "Route A"
        }
    });

};
