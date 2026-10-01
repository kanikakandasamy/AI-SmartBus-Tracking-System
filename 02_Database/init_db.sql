-- ============================================
-- AI Smart Bus Tracking and Notification System
-- Comprehensive Database Schema & Seed Data
-- ============================================

CREATE DATABASE IF NOT EXISTS ai_smart_bus;
USE ai_smart_bus;

-- 1. Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    license_no VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Buses Table
CREATE TABLE IF NOT EXISTS buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(50) NOT NULL UNIQUE,
    driver_id INT NULL,
    capacity INT DEFAULT 50,
    current_occupancy INT DEFAULT 24,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE SET NULL
);

-- 4. Routes Table
CREATE TABLE IF NOT EXISTS routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(100) NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    total_distance_km DECIMAL(6, 2) DEFAULT 16.50,
    estimated_duration_min INT DEFAULT 45,
    stops JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Students Table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    reg_no VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    bus_id INT NULL,
    stop_name VARCHAR(100) DEFAULT 'Anna Nagar Stop',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE SET NULL
);

-- 6. Allocations Table
CREATE TABLE IF NOT EXISTS allocations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    driver_id INT NOT NULL,
    route_id INT NOT NULL,
    shift VARCHAR(50) DEFAULT 'Morning',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
    FOREIGN KEY (driver_id) REFERENCES drivers(id) ON DELETE CASCADE,
    FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- 7. Tracking Table
CREATE TABLE IF NOT EXISTS tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    speed DECIMAL(5, 2) DEFAULT 0.00,
    heading DECIMAL(5, 2) DEFAULT 0.00,
    traffic_level VARCHAR(50) DEFAULT 'Normal',
    next_stop VARCHAR(100) DEFAULT 'Main Gate',
    distance_remaining_km DECIMAL(6, 2) DEFAULT 5.20,
    eta_minutes INT DEFAULT 12,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NULL,
    type VARCHAR(50) DEFAULT 'info',
    title VARCHAR(150) DEFAULT 'Transit Alert',
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

-- 9. SOS Alerts Table
CREATE TABLE IF NOT EXISTS sos_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NULL,
    sender_type VARCHAR(50) NOT NULL DEFAULT 'student',
    sender_name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8) NULL,
    longitude DECIMAL(11, 8) NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE SET NULL
);

-- ============================================
-- SEED INITIAL DATA
-- ============================================

-- Admins
INSERT INTO admins (id, name, email, password, role) VALUES
(1, 'Admin Officer', 'admin@smartbus.com', 'admin123', 'admin')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Drivers
INSERT INTO drivers (id, name, phone, license_no, email, password, status) VALUES
(1, 'Rajesh Kumar', '+91 98451 23456', 'DL-TN-02-2018-091', 'rajesh.driver@smartbus.com', 'driver123', 'On Duty'),
(2, 'Murugan Swamy', '+91 98765 43210', 'DL-TN-04-2019-142', 'murugan.driver@smartbus.com', 'driver123', 'Available'),
(3, 'Arunachalam S', '+91 94432 11223', 'DL-TN-07-2020-881', 'arun.driver@smartbus.com', 'driver123', 'On Duty'),
(4, 'Suresh Babu', '+91 97890 55667', 'DL-TN-09-2017-432', 'suresh.driver@smartbus.com', 'driver123', 'Available')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Buses
INSERT INTO buses (id, bus_number, driver_id, capacity, current_occupancy, status) VALUES
(1, 'BUS-101 (Alpha)', 1, 50, 36, 'Active'),
(2, 'BUS-102 (Beta)', 2, 50, 42, 'Active'),
(3, 'BUS-103 (Gamma)', 3, 40, 22, 'Active'),
(4, 'BUS-104 (Delta)', 4, 55, 15, 'Standby')
ON DUPLICATE KEY UPDATE bus_number=VALUES(bus_number);

-- Routes
INSERT INTO routes (id, route_name, source, destination, total_distance_km, estimated_duration_min, stops) VALUES
(1, 'Route 1 - North Express', 'Central Station', 'Engineering Campus', 18.2, 45, JSON_ARRAY(
    JSON_OBJECT('name', 'Central Station', 'lat', 13.0827, 'lng', 80.2707, 'sequence', 1),
    JSON_OBJECT('name', 'Kilpauk Garden', 'lat', 13.0812, 'lng', 80.2405, 'sequence', 2),
    JSON_OBJECT('name', 'Anna Nagar East', 'lat', 13.0850, 'lng', 80.2101, 'sequence', 3),
    JSON_OBJECT('name', 'Thirumangalam Metro', 'lat', 13.0835, 'lng', 80.1925, 'sequence', 4),
    JSON_OBJECT('name', 'Ambattur Estate', 'lat', 13.0980, 'lng', 80.1620, 'sequence', 5),
    JSON_OBJECT('name', 'Engineering Campus Main Gate', 'lat', 13.1145, 'lng', 80.1410, 'sequence', 6)
)),
(2, 'Route 2 - South Link', 'Tambaram Hub', 'Engineering Campus', 22.0, 50, JSON_ARRAY(
    JSON_OBJECT('name', 'Tambaram Sanatorium', 'lat', 12.9304, 'lng', 80.1250, 'sequence', 1),
    JSON_OBJECT('name', 'Chromepet Station', 'lat', 12.9516, 'lng', 80.1412, 'sequence', 2),
    JSON_OBJECT('name', 'Pallavaram Flyover', 'lat', 12.9675, 'lng', 80.1500, 'sequence', 3),
    JSON_OBJECT('name', 'Guindy Industrial Estate', 'lat', 13.0067, 'lng', 80.2025, 'sequence', 4),
    JSON_OBJECT('name', 'Engineering Campus Main Gate', 'lat', 13.1145, 'lng', 80.1410, 'sequence', 5)
)),
(3, 'Route 3 - West Corridor', 'Porur Junction', 'Engineering Campus', 14.5, 35, JSON_ARRAY(
    JSON_OBJECT('name', 'Porur Toll', 'lat', 13.0382, 'lng', 80.1565, 'sequence', 1),
    JSON_OBJECT('name', 'Iyyappanthangal Depot', 'lat', 13.0450, 'lng', 80.1380, 'sequence', 2),
    JSON_OBJECT('name', 'Poonamallee Bypass', 'lat', 13.0510, 'lng', 80.0950, 'sequence', 3),
    JSON_OBJECT('name', 'Engineering Campus Main Gate', 'lat', 13.1145, 'lng', 80.1410, 'sequence', 4)
))
ON DUPLICATE KEY UPDATE route_name=VALUES(route_name);

-- Allocations
INSERT INTO allocations (id, bus_id, driver_id, route_id, shift) VALUES
(1, 1, 1, 1, 'Morning Shift'),
(2, 2, 2, 2, 'Morning Shift'),
(3, 3, 3, 3, 'Morning Shift')
ON DUPLICATE KEY UPDATE shift=VALUES(shift);

-- Students
INSERT INTO students (id, name, reg_no, email, password, bus_id, stop_name) VALUES
(1, 'Kanika Kandasamy', '2026CS101', 'kanika@smartbus.com', 'student123', 1, 'Anna Nagar East'),
(2, 'Aditya Verma', '2026EC102', 'aditya@smartbus.com', 'student123', 1, 'Kilpauk Garden'),
(3, 'Priya Soundar', '2026IT103', 'priya@smartbus.com', 'student123', 2, 'Chromepet Station'),
(4, 'Deepak Nathan', '2026ME104', 'deepak@smartbus.com', 'student123', 3, 'Porur Toll')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Tracking initial data (real coordinates)
INSERT INTO tracking (id, bus_id, latitude, longitude, speed, heading, traffic_level, next_stop, distance_remaining_km, eta_minutes) VALUES
(1, 1, 13.0842, 80.2050, 36.5, 280.0, 'Moderate', 'Anna Nagar East', 4.8, 9),
(2, 2, 12.9810, 80.1780, 42.0, 310.0, 'Normal', 'Guindy Industrial Estate', 8.2, 15),
(3, 3, 13.0470, 80.1250, 28.0, 345.0, 'Heavy', 'Poonamallee Bypass', 6.1, 18)
ON DUPLICATE KEY UPDATE latitude=VALUES(latitude), longitude=VALUES(longitude), speed=VALUES(speed);

-- Notifications
INSERT INTO notifications (id, bus_id, type, title, message) VALUES
(1, 1, 'arrival', 'Bus Approaching Stop', 'BUS-101 is 4.8 km away from Anna Nagar East. Estimated arrival in 9 minutes.'),
(2, 1, 'delay', 'Traffic Congestion Advisory', 'Heavy traffic noticed near Thirumangalam signal. ETA adjusted by +3 minutes.'),
(3, 2, 'info', 'Shift Started', 'BUS-102 (Beta) has departed Tambaram Hub on schedule.')
ON DUPLICATE KEY UPDATE message=VALUES(message);
