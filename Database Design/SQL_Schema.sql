-- AI Smart Bus Tracking and Notification System
-- Final Optimized Database Schema

CREATE DATABASE SmartBusDB;
USE SmartBusDB;

-- 1. Users Table
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin', 'driver') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Route Table
CREATE TABLE Route (
    route_id INT AUTO_INCREMENT PRIMARY KEY,
    route_name VARCHAR(100) NOT NULL,
    start_point VARCHAR(100),
    end_point VARCHAR(100)
);

-- 3. Bus Table
CREATE TABLE Bus (
    bus_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_number VARCHAR(20) UNIQUE NOT NULL,
    capacity INT,
    driver_id INT,
    route_id INT,
    FOREIGN KEY (driver_id) REFERENCES Users(user_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,
    FOREIGN KEY (route_id) REFERENCES Route(route_id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

-- 4. Bus Stop Table
CREATE TABLE BusStop (
    stop_id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    stop_name VARCHAR(100) NOT NULL,
    stop_order INT,
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    FOREIGN KEY (route_id) REFERENCES Route(route_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- 5. Live Bus Location Tracking
CREATE TABLE BusLocation (
    location_id INT AUTO_INCREMENT PRIMARY KEY,
    bus_id INT NOT NULL,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    speed DECIMAL(5,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES Bus(bus_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    INDEX idx_bus_time (bus_id, recorded_at)
);

-- 6. Student Bus Allocation
CREATE TABLE BusAllocation (
    allocation_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    bus_id INT NOT NULL,
    route_id INT NOT NULL,
    allocated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES Bus(bus_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (route_id) REFERENCES Route(route_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- 7. Notifications Table
CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    status ENUM('sent', 'read') DEFAULT 'sent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
