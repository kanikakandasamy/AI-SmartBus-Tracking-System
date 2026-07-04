# Sample Data - AI Smart Bus Tracking System

This file contains sample data for all tables in SmartBusDB.

---

## 1. Users

```sql
INSERT INTO Users (name, email, phone, password, role)
VALUES 
('Admin', 'admin@college.com', '9876543210', 'admin123', 'admin'),
('Student One', 'student1@gmail.com', '9123456780', 'pass123', 'student'),
('Driver One', 'driver1@gmail.com', '9988776655', 'driver123', 'driver');

---

## 2. Routes

INSERT INTO Route (route_name, start_point, end_point)
VALUES 
('Route A', 'College', 'Town'),
('Route B', 'College', 'City');

---

## 3. Buses

INSERT INTO Bus (bus_number, capacity, driver_id, route_id)
VALUES 
('TN01A1234', 40, 3, 1),
('TN02B5678', 45, 3, 2);

---

## 4. Bus Stops

INSERT INTO BusStop (route_id, stop_name, stop_order, latitude, longitude)
VALUES 
(1, 'Stop 1', 1, 13.0827, 80.2707),
(1, 'Stop 2', 2, 13.0878, 80.2784);

---

## 5. Bus Location

INSERT INTO BusLocation (bus_id, latitude, longitude, speed)
VALUES 
(1, 13.0827, 80.2707, 30.5),
(2, 13.0878, 80.2784, 25.0);

---

## 6. Bus Allocation

INSERT INTO BusAllocation (student_id, bus_id, route_id)
VALUES 
(2, 1, 1);

---

## 7. Notifications

INSERT INTO Notifications (user_id, message, status)
VALUES 
(2, 'Your bus will arrive in 10 minutes', 'sent'),
(2, 'Bus has reached Stop 1', 'read');

